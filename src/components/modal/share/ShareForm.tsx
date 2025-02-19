import SubmitButton from "@/components/button/SubmitButton";
import { DocumentProps } from "@/types/document.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRef, useEffect, useMemo, useState } from "react";
import CloseIcon from '../../../../public/svgs/close.svg';
import Image from "next/image";
import axios from "axios";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { addCollaborator } from "@/redux/features/document/documentSlice";
import { addCoworker, setSelectedCoworkers, setTargetSharingEmail } from "@/redux/features/document/shareDocumentSlice";

type ShareFormProps = {
    selectedDoc: DocumentProps;
}

export default function ShareForm({ selectedDoc }: ShareFormProps) {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const selectedCoworkers = useAppSelector(state => state.selectedCoworkers);
    const targetSharingEmail = useAppSelector(state => state.targetSharingEmail);
    const editorPermission = useAppSelector(state => state.editorPermission);

    // 이미 추가된 협업자들을 필터링
    const alreadyExistCoworkers = useMemo(() => selectedCoworkers.filter(selectedCoworker =>
        selectedDoc.collaborators.some(coworker => coworker.email === selectedCoworker.email)),
        [selectedCoworkers, selectedDoc.collaborators]);

    // 선택된 협업자들을 문서에 추가
    const inviteUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            dispatch(setWorkingSpinner(true));

            // 추가중인 협업자를 문서에 추가
            const newDoc = {
                ...selectedDoc,
                collaborators: [...selectedDoc.collaborators, ...selectedCoworkers],
            }

            if (alreadyExistCoworkers.length > 0) {
                dispatch(showWarningAlert('이미 멤버로 추가된 사용자가 있습니다.'));
                return;
            }

            // 협업자 추가 요청
            await axios.post('/api/document/coworker', {
                email: newDoc.author,
                docId: newDoc.id,
                collaborators: selectedCoworkers,
            });

            // 추가중인 협업자들을 순회하면서 한 명씩 state에 push
            selectedCoworkers.forEach(coworker => dispatch(addCoworker(coworker)));

            dispatch(addCollaborator({ docId: newDoc.id, collaborators: selectedCoworkers }));
            dispatch(showCompleteAlert('선택된 사용자들을 멤버로 초대했습니다.'));

            dispatch(setSelectedCoworkers([])); // 작업을 마쳤으니 선택된 협업자들을 초기화
        } catch (error) {
            dispatch(showWarningAlert('선택된 사용자들을 멤버로 초대하는 데 실패했습니다.'));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    // 추가중인 협업자를 제거
    const removeCoworker = (email: string) => {
        const newSelectedCoworker = selectedCoworkers.filter(coworker => coworker.email !== email);
        dispatch(setSelectedCoworkers(newSelectedCoworker));
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (
        <form
            onSubmit={inviteUser}
            className='flex flex-col'
            noValidate>
            <div className="flex flex-row items-center justify-between px-5 gap-6">
                <div className={`flex flex-wrap items-center w-[480px] rounded border px-3 py-2 transition-all duration-200
                    ${alreadyExistCoworkers.length > 0 ? 'border border-red-500 border-solid' : 'border-gray-300 focus-within:border-gray-600 '}`}>
                    {
                        // 추가중인 사용자들을 input 내부에 표시
                        selectedCoworkers.map((coworker) => (
                            <div
                                key={coworker.email}
                                // 이미 멤버로 추가된 사용자가 있다면 알림
                                className={`flex flex-row justify-between items-center bg-gray-100 rounded-xl p-[5px] mr-2 my-0.5
                                    ${alreadyExistCoworkers.some(user => user.email === coworker.email) && 'border border-red-500 border-solid'}`}>
                                <Image
                                    src={coworker.photoURL === 'unknown-user' ? '/svgs/avatar.svg' : coworker.photoURL}
                                    alt={coworker.displayName}
                                    width={21}
                                    height={21}
                                    className="rounded-full mr-2" />
                                <span className="text-sm">{coworker.displayName}</span>
                                <button
                                    type="button"
                                    onClick={() => removeCoworker(coworker.email)}
                                    className="ml-1 text-gray-500 hover:text-gray-700">
                                    <CloseIcon
                                        width="21"
                                        height="21" />
                                </button>
                            </div>
                        ))
                    }
                    <input
                        type="email"
                        ref={inputRef}
                        className='border-none text-[15px] outline-none bg-transparent flex-grow'
                        value={targetSharingEmail}
                        onChange={(e) => dispatch(setTargetSharingEmail(e.target.value))}
                        placeholder={selectedCoworkers.length > 0 ? "" : "초대할 사용자의 이메일"}
                        autoFocus
                        disabled={editorPermission !== '전체 허용'} />
                </div>
                <SubmitButton
                    style={{
                        width: 'w-14',
                        height: 'h-[40px]',
                        textSize: 'text-sm',
                        textColor: 'text-white',
                        bgColor: 'bg-blue-500',
                        hover: 'hover:bg-blue-700',
                    }}
                    label='초대'
                    value={selectedCoworkers.length > 0 && editorPermission === '전체 허용'}
                    onClick={inviteUser} />
            </div>
            {
                alreadyExistCoworkers.length > 0 && (
                    <div className="text-[13px] ml-5 mt-2 pl-0.5 text-red-500">이미 멤버로 추가된 사용자가 있습니다</div>
                )
            }
        </form>
    );
}