import { useState } from 'react';
import Modal from 'react-modal';
import CommonInput from '../input/CommonInput';
import SubmitButton from '../button/SubmitButton';
import CommonButton from '../button/CommonButton';
import ModalHeader from './ModalHeader';
import useOverlayLock from '@/hooks/common/useOverlayLock';
import { useAppDispatch } from '@/redux/hooks';
import { setWorkingSpinner } from '@/redux/features/common/placeholderSlice';
import { ModalProps } from '../../types/modalProps.type';

export interface AddInputModal extends ModalProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    submitFunction: () => Promise<boolean>;
    category: 'document' | 'folder';
    isInvalidInfo?: { isInvalid: boolean, msg: string };
    setIsInvalidInfo?: React.Dispatch<React.SetStateAction<{ isInvalid: boolean; msg: string }>>;
}

export default function AddInputModal({
    isModalOpen,
    setIsModalOpen,
    value,
    setValue,
    submitFunction,
    category,
    isInvalidInfo,
    setIsInvalidInfo }: AddInputModal) {
    const dispatch = useAppDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const modalSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
        // 중복 제출을 방지하기 위해 제출 중일 때는 무시
        if (value && !isSubmitting) {
            dispatch(setWorkingSpinner(true));
            setIsSubmitting(true); // 현재 제출중
            try {
                const isFailed = await submitFunction();
                if (isFailed) return; // 실패 시 모달을 닫지 않음
                setIsModalOpen(false);
                setValue('');
            } finally {
                setIsSubmitting(false);
                dispatch(setWorkingSpinner(false));
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

    useOverlayLock(isModalOpen);

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
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
            <form
                onSubmit={modalSubmit}
                onKeyDown={keyPressSubmit}
                className='flex flex-col h-full justify-between'>
                <div>
                    <ModalHeader
                        label={<div className='font-semibold'>{category === 'document' ? '내 폴더에 문서 추가하기' : '새 폴더 만들기'}</div>}
                        closeModal={closeModal} />
                    <div className="flex flex-col px-6">
                        <div className='text-sm font-medium mt-2 mb-2 pl-0.5'>
                            {category === 'document' ? '문서명' : '폴더명'}
                        </div>
                        <CommonInput
                            style={{
                                px: 'px-3',
                                py: 'py-2',
                                textSize: 'text-[15px]',
                            }}
                            type="text"
                            value={value}
                            setValue={setValue}
                            placeholder={category === 'document' ? '추가할 문서의 이름을 입력해주세요' : '새 폴더의 이름을 입력해주세요'}
                            isInvalidInfo={isInvalidInfo}
                            autoFocus={true} />
                    </div>
                </div>
                {/* 하단 버튼 영역 */}
                <div className='flex justify-end text-sm gap-3.5 px-6 pb-6'>
                    <SubmitButton
                        style={{
                            width: 'w-16',
                            height: 'h-[38px]',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-700',
                        }}
                        label="만들기"
                        value={value} />
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
                        onClick={closeModal} />
                </div>
            </form>
        </Modal>
    )
}