import { ModalProps } from '@/types/modalProps';
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
    const modalSubmit = () => {
        submitFunction();
        setIsModalOpen(false);
    }
    const closeModal = () => {
        setValue('');
        setIsModalOpen(false);
    }
    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    position: 'fixed', // 화면 전체를 덮도록 
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
                    top: '50%',
                    width: 500,
                    height: 220,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001, // 모달 자체는 오버레이보다 높은 z-index
                }
            }}>
            <div className='flex flex-col h-full justify-between'>
                <div>
                    <div className='font-semibold mb-4'>{title}</div>
                    <div className='text-sm mt-2 mb-2'>이름</div>
                    <div className='rounded border border-gray-300 w-full px-3 py-1.5 focus-within:border-gray-600 transition-all duration-200'>
                        <input
                            className='border-none text-sm outline-none bg-transparent w-full'
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder} />
                    </div>
                </div>
                {/* 하단 버튼 영역 */}
                <div className='flex justify-end text-sm gap-3.5'>
                    {/* value 값이 입력돼있지 않으면 submit 불가 */}
                    <button
                        onClick={modalSubmit}
                        className={`px-3 py-1.5 border rounded text-white transition-all duration-200
                            ${value ? 'border-blue-500 bg-blue-500 hover:border-blue-700 hover:bg-blue-700' :
                                'border-gray-300 bg-gray-300 cursor-not-allowed'}`}
                        disabled={!value} >
                        만들기
                    </button>
                    <button
                        className='px-3 py-1.5 border rounded border-gray-400 text-gray-500 
                        hover:border-gray-600 hover:text-[#444444] hover:bg-gray-100 transition-all duration-200'
                        onClick={closeModal}>취소</button>
                </div>
            </div>
        </Modal>
    )
}
