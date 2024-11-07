import { ModalProps } from '@/types/modalProps';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import CommonInput from '../input/CommonInput';
import SubmitButton from '../button/SubmitButton';
import CommonButton from '../button/CommonButton';
import ModalHeader from './ModalHeader';

export interface AddInputModal extends ModalProps {
    title: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    submitFunction: () => Promise<boolean>;
    isInvalidInfo?: { isInvalid: boolean, msg: string };
    setIsInvalidInfo?: React.Dispatch<React.SetStateAction<{ isInvalid: boolean; msg: string }>>;
    placeholder: string;
}

export default function AddInputModal({
    isModalOpen,
    setIsModalOpen,
    title,
    value,
    setValue,
    submitFunction,
    isInvalidInfo,
    setIsInvalidInfo,
    placeholder }: AddInputModal) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modalSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
        // 중복 제출을 방지하기 위해 제출 중일 때는 무시
        if (value && !isSubmitting) {
            setIsSubmitting(true); // 현재 제출중
            try {
                const isFailed = await submitFunction();
                if (isFailed) return; // 실패 시 모달을 닫지 않음
                setIsModalOpen(false);
                setValue('');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    const closeModal = () => {
        setValue('');
        setIsModalOpen(false);
        setIsInvalidInfo && setIsInvalidInfo({
            msg: '',
            isInvalid: false,
        })
    }

    const keyPressSubmit = async (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await modalSubmit(e);
        }
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
                onSubmit={modalSubmit}
                onKeyDown={keyPressSubmit}
                className='flex flex-col h-full justify-between'>
                <div>
                    <ModalHeader
                        label={<div className='font-semibold'>{title}</div>}
                        closeModal={closeModal} />
                    <div className="flex flex-col px-6">
                        <div className='text-sm mt-2 mb-2 pl-0.5'>폴더</div>
                        <CommonInput
                            style={{
                                px: 'px-3',
                                py: 'py-2',
                                textSize: 'text-[15px]',
                            }}
                            type="text"
                            value={value}
                            setValue={setValue}
                            placeholder={placeholder}
                            isInvalidInfo={isInvalidInfo}
                            autoFocus={true} />
                    </div>
                </div>
                {/* 하단 버튼 영역 */}
                <div className='flex justify-end text-sm gap-3.5 px-6 pb-6'>
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
                        value={value} />
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