import Modal from "react-modal";
import ModalHeader from "./ModalHeader";
import WarningIcon from '../../../public/svgs/warning.svg';
import CommonButton from "../button/CommonButton";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import SubmitButton from "../button/SubmitButton";
import logout from "@/utils/auth/logout";
import { ModalProps } from "@/types/modalProps.type";

export default function WithdrawlModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const dispatch = useAppDispatch();

    // 회원 탈퇴 처리
    const deleteAccount = async () => {
        dispatch(setWorkingSpinner(true));

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                dispatch(showWarningAlert('로그인이 필요합니다.'));
                return;
            }

            // 사용자 삭제
            await currentUser.delete();

            setIsModalOpen(false);

            // 로그아웃 처리
            await logout(dispatch);
        } catch (error) {
            dispatch(showWarningAlert('회원 탈퇴에 실패했습니다.'));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    useEffect(() => {
        const enterCloseEvent = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                deleteAccount();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', enterCloseEvent);
        }

        return () => {
            window.removeEventListener('keydown', enterCloseEvent);
        };
    }, [isModalOpen]);

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 500,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 500,
                    height: 240,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                }
            }}>
            <div className="flex flex-col h-full justify-between">
                <div>
                    <ModalHeader
                        label={<div className='font-semibold'>회원 탈퇴</div>}
                        closeModal={() => setIsModalOpen(false)} />
                    <div className="flex flex-col px-6 gap-4 mt-1.5">
                        <div className="text-[15px]">계정을 정말로 삭제하시겠습니까?</div>
                        <div className="flex flex-row items-center gap-2 bg-red-100 rounded px-4 py-3">
                            <WarningIcon width="23" />
                            <div className="text-sm text-red-500">이 작업은 되돌릴 수 없으며, 영구적으로 삭제됩니다.</div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end text-sm gap-3.5 px-6 pb-6'>
                    <SubmitButton
                        style={{
                            width: 'w-16',
                            height: 'h-[38px]',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-red-500',
                            hover: 'hover:bg-red-600',
                            borderColor: 'border-red-500',
                        }}
                        label='삭제'
                        onClick={deleteAccount}
                        value={true} />
                    <CommonButton
                        style={{
                            width: 'w-14',
                            height: 'h-[38px]',
                            textSize: 'text-sm',
                            textColor: 'text-gray-500',
                            bgColor: 'bg-transparent',
                            hover: 'hover:border-gray-600',
                        }}
                        label='취소'
                        onClick={() => setIsModalOpen(false)} />
                </div>
            </div>
        </Modal>
    )
}