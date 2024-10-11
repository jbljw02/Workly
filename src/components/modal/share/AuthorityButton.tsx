import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateCoworkerAuthority } from '@/redux/features/shareDocumentSlice';
import { Collaborator } from '@/redux/features/documentSlice';
import axios from 'axios';

type AuthorityCategory = '전체 허용' | '쓰기 허용' | '읽기 허용' | '관리자' | '멤버 제거';

type DropdownProps = {
    dropdownPosition: { top: number; left: number };
    setIsOpen: (isOpen: boolean) => void;
    buttonRef: React.RefObject<HTMLDivElement>;
    targetUser: Collaborator;
    isMember?: boolean;
}

type AuthorityButtonProps = {
    initialAuthority: AuthorityCategory;
    targetUser: Collaborator;
    isClickEnabled?: boolean;
    isMember?: boolean;
}

// 권한을 선택하는 드롭다운
function Dropdown({
    dropdownPosition,
    setIsOpen,
    buttonRef,
    targetUser,
    isMember }: DropdownProps) {
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const targetSharingEmail = useAppSelector(state => state.targetSharingEmail);

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

    // 선택한 사용자의 권한 변경
    const selectAutority = async (authorEmail: string, targetemail: string, docId: string, authority: AuthorityCategory) => {
        if (isMember) {
            await axios.put('/api/document/coworker', {
                authorEmail: authorEmail,
                targetEmail: targetemail,
                docId: docId,
                newAuthority: authority
            })

            dispatch(updateCoworkerAuthority({ email: targetemail, newAuthority: authority }));
        }
        else {
            dispatch(updateCoworkerAuthority({ email: targetemail, newAuthority: authority }));
        }
        setIsOpen(false);
    }

    useClickOutside(dropdownRef, () => setIsOpen(false), buttonRef);

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 50,
            }}
            className='flex flex-col bg-white border border-gray-200 rounded shadow-xl'>
            {
                authorityList.map((authority, index) => (
                    <div
                        key={index}
                        className='flex flex-col px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer'
                        onClick={() => selectAutority(selectedDocument.author, targetUser.email, selectedDocument.id, authority.label as AuthorityCategory)}>
                        <div className='text-sm'>{authority.label}</div>
                        <div className='text-xs text-neutral-400 whitespace-nowrap'>{authority.description}</div>
                    </div>
                ))
            }
            {

            }
        </div>
    );
}

export default function AuthorityButton({
    initialAuthority,
    targetUser,
    isClickEnabled,
    isMember }: AuthorityButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    // 초기 권한 상태로 설정하고, 권한이 변경될 때마다 업데이트
    const [authority, setAuthority] = useState<AuthorityCategory>(initialAuthority);

    useEffect(() => {
        if (!buttonRef.current) return;

        // 드롭다운 위치를 업데이트하는 함수
        const updatePosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                // 버튼의 위치를 기반으로 드롭다운 위치 설정
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        };

        const resizeObserver = new ResizeObserver(updatePosition);
        resizeObserver.observe(buttonRef.current);

        // 드롭다운이 열릴 때 위치 업데이트
        if (isOpen) {
            updatePosition();
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [isOpen]);

    return (
        <>
            <div
                ref={buttonRef}
                onClick={(e) => {
                    if (initialAuthority !== '관리자' && isClickEnabled) {
                        e.stopPropagation();
                        setIsOpen((prevState) => !prevState);
                    }
                }}
                // 클릭이 활성화된 상태이거나 관리자 권한이 아닐 때만
                className={`flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded select-none 
                    ${initialAuthority === '관리자' ? '' :
                        (isClickEnabled ? 'hover:bg-gray-200 cursor-pointer' : '')}`}>
                {
                    initialAuthority === '관리자' ?
                        <div className='whitespace-nowrap text-sm mr-9'>관리자</div> :
                        <>
                            <div className='whitespace-nowrap text-sm'>{initialAuthority}</div>
                            <ArrowIcon width="17" />
                        </>
                }
            </div>
            <div>
                {/* React Portal을 이용하여 독립적으로 렌더링 */}
                {
                    isOpen &&
                    createPortal(
                        <Dropdown
                            dropdownPosition={dropdownPosition}
                            setIsOpen={setIsOpen}
                            buttonRef={buttonRef}
                            targetUser={targetUser}
                            isMember={isMember} />,
                        document.body)
                }
            </div>
        </>
    );
}