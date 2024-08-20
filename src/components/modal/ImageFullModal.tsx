import Modal from 'react-modal';
import { ModalProps } from '@/types/modalProps';
import { useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

interface ImageFullModal extends ModalProps {
    src: string;
}

export default function ImageFullModal({ isModalOpen, setIsModalOpen, src }: ImageFullModal) {
    const imgRef = useRef<HTMLImageElement>(null);

    useClickOutside(imgRef, () => setIsModalOpen(false));

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
                content: {
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `100vw`,
                    padding: '40px 0px',
                    height: `100vh`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    background: 'none',
                    border: 'none',
                }
            }}>
            <img
                ref={imgRef}
                src={src}
                style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                }} />

        </Modal>
    );
}
