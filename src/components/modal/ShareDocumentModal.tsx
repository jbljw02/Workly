import { ModalProps } from '@/types/modalProps';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import CommonInput from '../input/CommonInput';
import SubmitButton from '../button/SubmitButton';
import CommonButton from '../button/CommonButton';
import CloseIcon from '../../../public/svgs/close.svg';

export interface ShareDocumentModalProps extends ModalProps {
}

export default function ShareDocumentModal({
    isModalOpen,
    setIsModalOpen }: ShareDocumentModalProps) {

    const [targetEmail, setTargetEmail] = useState<string>('');

    const closeModal = () => {
        setTargetEmail('');
        setIsModalOpen(false);
    }

    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 500,
                    height: 240,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                    padding: 0,
                }
            }}>
            <form
                className='flex flex-col h-full justify-between py-7'>
                <div>
                    <div className='mb-4'>
                        <div className='flex flex-row gap-4 border-b px-6 pb-2 '>
                            <div className=''>다른 사용자와 공유</div>
                            <div className=''>웹 페이지로 게시</div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5">
                            <CloseIcon
                                className="hover:text-gray-500"
                                width="18" />
                        </button>
                    </div>
                    <div className='flex flex-row items-center justify-between px-5 gap-6'>
                        <CommonInput
                            type="text"
                            value={targetEmail}
                            setValue={setTargetEmail}
                            placeholder={'초대할 사용자의 이메일'}
                            autoFocus={true} />
                        <CommonButton
                            style={{
                                px: 'px-3.5',
                                py: 'py-2',
                                textSize: 'text-sm',
                                textColor: 'text-white',
                                bgColor: 'bg-blue-500',
                                hover: 'hover:bg-blue-700',
                            }}
                            label='초대'
                            onClick={closeModal} />
                    </div>
                </div>
                {/* 하단 버튼 영역 */}
                <div className='flex justify-end text-sm gap-3.5 px-5'>
                    <SubmitButton
                        style={{
                            px: 'px-3.5',
                            py: 'py-2',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-700',
                        }}
                        label="만들기"
                        value={targetEmail} />
                    <CommonButton
                        style={{
                            px: 'px-3.5',
                            py: 'py-2',
                            textSize: 'text-sm',
                            textColor: 'text-gray-500',
                            bgColor: 'bg-transparent',
                            hover: 'hover:border-gray-600',
                        }}
                        label='취소'
                        onClick={closeModal} />
                </div>
            </form>
        </Modal>
    )
}