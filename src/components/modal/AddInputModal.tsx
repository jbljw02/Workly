import { ModalProps } from '@/types/modalProps';
import { useRef } from 'react';
import Modal from 'react-modal';

export interface AddInputModal extends ModalProps {
    title: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    submitFunction: () => void;
    placeholder: string;
}

export default function AddInputModal({
    isModalOpen,
    setIsModalOpen,
    title,
    value,
    setValue,
    submitFunction,
    placeholder }: AddInputModal) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const modalSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
        submitFunction();
        setIsModalOpen(false);
    }

    const closeModal = () => {
        setValue('');
        setIsModalOpen(false);
    }

    // 모달 오픈 시 바로 input으로 포커스
    const afterOpenModal = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onAfterOpen={afterOpenModal}
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
                    height: 220,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                }
            }}>
            <form
                onSubmit={modalSubmit}
                className='flex flex-col h-full justify-between'>
                <div>
                    <div className='font-semibold mb-4'>{title}</div>
                    <div className='text-sm mt-2 mb-2'>이름</div>
                    <div className='rounded border border-gray-300 w-full px-3 py-1.5 focus-within:border-gray-600 transition-all duration-200'>
                        <input
                            ref={inputRef}
                            className='border-none text-sm outline-none bg-transparent w-full'
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder} />
                    </div>
                </div>
                {/* 하단 버튼 영역 */}
                <div className='flex justify-end text-sm gap-3.5'>
                    <button
                        type="submit"
                        className={`px-3 py-1.5 border rounded text-white transition-all duration-200
                            ${value ? 'border-blue-500 bg-blue-500 hover:border-blue-700 hover:bg-blue-700' :
                                'border-gray-300 bg-gray-300 cursor-not-allowed'}`}
                        disabled={!value}>
                        만들기
                    </button>
                    <button
                        type="button" // 취소 버튼은 폼 제출을 막기 위해 type="button"
                        className='px-3 py-1.5 border rounded border-gray-400 text-gray-500 
                        hover:border-gray-600 hover:text-[#444444] hover:bg-gray-100 transition-all duration-200'
                        onClick={closeModal}>
                        취소
                    </button>
                </div>
            </form>
        </Modal>
    )
}