import React, { useRef, useEffect, useState } from "react";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import { addCollaborator, Collaborator, deleteCollaborator, DocumentProps, updateCollaboratorAuthority, updateDocuments } from "@/redux/features/documentSlice";
import { deleteCoworker, setCoworkerList, updateCoworkerAuthority, updateSearchedCoworkerAuthority } from "@/redux/features/shareDocumentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { AuthorityCategory } from "./AuthorityButton";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import useOverlayLock from "@/components/hooks/useOverlayLock";

type AuthorityDropdownProps = {
    dropdownPosition: { top: number, left: number };
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedDoc: DocumentProps;
    buttonRef: React.RefObject<HTMLDivElement>;
    targetUser: Collaborator;
    isMember?: boolean;
    setCurrentAuthority: (authority: AuthorityCategory) => void;
}

export default function AuthorityDropdown({
    dropdownPosition,
    isOpen,
    setIsOpen,
    selectedDoc,
    buttonRef,
    targetUser,
    isMember,
    setCurrentAuthority
}: AuthorityDropdownProps) {
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const coworkerList = useAppSelector(state => state.coworkerList);

    const authorityList = [
        {
            label: '전체 허용',
            description: '문서를 편집하고, 다른 사용자에게 공유할 수 있습니다.'
        },
        {
            label: '쓰기 허용',
            description: '문서를 열람하고 편집할 수 있습니다.'
        },
        {
            label: '읽기 허용',
            description: '문서를 열람할 수 있습니다.'
        },
        // 이미 문서의 멤버인 경우
        ...(isMember ? [{
            label: '멤버 제거',
            description: '이 사용자를 문서에서 제거합니다.'
        }] : []),
    ];

    // 권한을 업데이트
    const updateAuthority = async (authorEmail: string, targetEmail: string, docId: string, authority: AuthorityCategory) => {
        // 이미 문서의 멤버인 경우 권한 변경을 서버로 요청
        if (isMember) {
            // 멤버 제거 요청
            if (authority === '멤버 제거') {
                const prevCoworkerList = [...coworkerList];
                try {
                    // coworkerList와 documents에서 모두 협업자를 삭제
                    dispatch(deleteCoworker(targetUser.email));
                    dispatch(deleteCollaborator({ docId: selectedDoc.id, email: targetUser.email }));
                    setIsOpen(false);

                    await axios.delete('/api/document/coworker', {
                        params: {
                            authorEmail: authorEmail,
                            targetEmail: targetUser.email,
                            docId: docId
                        }
                    });

                    dispatch(showCompleteAlert('멤버를 제거했습니다.'));
                } catch (error) {
                    console.error(error);

                    // 요청에 실패할 경우 기존 상태로 롤백
                    dispatch(setCoworkerList(prevCoworkerList));
                    dispatch(addCollaborator({ docId: selectedDoc.id, collaborators: [prevCoworkerList] }));
                    setIsOpen(false);
                    dispatch(showWarningAlert('멤버 제거에 실패했습니다.'));
                }
            }
            // 권한 변경 요청
            else {
                const prevAuthority = targetUser.authority;
                try {
                    // coworkerList와 documents 모두 권한을 변경
                    dispatch(updateCoworkerAuthority({ email: targetUser.email, newAuthority: authority }));
                    dispatch(updateCollaboratorAuthority({ docId: selectedDoc.id, email: targetUser.email, newAuthority: authority }));
                    setCurrentAuthority(authority);

                    setIsOpen(false);

                    await axios.put('/api/document/coworker', {
                        authorEmail: authorEmail,
                        targetEmail: targetEmail,
                        docId: docId,
                        newAuthority: authority
                    });
                } catch (error) {
                    console.error(error);
                    // 요청에 실패할 경우 기존 상태로 롤백
                    dispatch(updateCoworkerAuthority({ email: targetUser.email, newAuthority: prevAuthority }));
                    dispatch(updateCollaboratorAuthority({ docId: selectedDoc.id, email: targetUser.email, newAuthority: prevAuthority }));
                    setCurrentAuthority(prevAuthority);

                    setIsOpen(false);
                    dispatch(showWarningAlert('권한 변경에 실패했습니다.'));
                }
            }
        }
        // 멤버가 아닐 경우 단순 화면에 보이는 권한만 변경
        else {
            dispatch(updateSearchedCoworkerAuthority({ email: targetUser.email, newAuthority: authority }));
            setCurrentAuthority(authority);
            setIsOpen(false);
        }
    };

    useClickOutside(dropdownRef, () => setIsOpen(false), buttonRef);

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 503,
            }}
            className='flex flex-col bg-white border border-gray-200 rounded shadow-xl'
            onClick={(e) => e.stopPropagation()}>
            {
                authorityList.map((authority, index) => (
                    <div
                        key={index}
                        className='flex flex-col px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer'
                        onClick={() => updateAuthority(selectedDoc.author.email, targetUser.email, selectedDoc.id, authority.label as AuthorityCategory)}>
                        <div className='text-sm'>{authority.label}</div>
                        <div className='text-xs text-neutral-400 whitespace-nowrap'>{authority.description}</div>
                    </div>
                ))
            }
        </div>
    );
}
