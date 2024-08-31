import { ModalProps } from '@/types/modalProps';
import Modal from 'react-modal';

interface NoticeModal extends ModalProps {
    label: string | React.ReactNode;
}

export default function NoticeModal({ isModalOpen, setIsModalOpen, label }: NoticeModal) {

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '48%',
                    width: 430,
                    height: 170,
                    transform: 'translate(-50%, -50%)',
                }
            }}>
            <div className='flex flex-col'>
                <div className='font-bold'>안내</div>
                <div className='text-sm mt-2'>{label}</div>
                <div className='flex justify-end mt-8'>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className='px-2 py-1 rounded-sm text-sm font-bold hover:underline cursor-pointer'>확인</button>
                </div>
            </div>
        </Modal>
    )
}
