import Modal from 'react-modal';
import { useRef, ReactNode } from 'react';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import DownloadIcon from '../../../public/svgs/editor/download.svg';
import CloseIcon from '../../../public/svgs/editor/close.svg';
import useOverlayLock from '@/hooks/common/useOverlayLock';
import { ModalProps } from '@/types/modalProps.type';
import { useAppDispatch } from '@/redux/hooks';
import downloadFile from '@/utils/editor/downloadFile';

interface FileFullModal extends ModalProps {
    children: ReactNode;
    href: string;
    download: string;
}

export default function FileFullModal({
    isModalOpen,
    setIsModalOpen,
    children,
    href,
    download }: FileFullModal) {
    const modalRef = useRef<HTMLDivElement>(null);
    const downloadRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, () => setIsModalOpen(false), downloadRef);
    useOverlayLock(isModalOpen);

    const dispatch = useAppDispatch();

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            shouldCloseOnEsc={true}
            style={{
                overlay: {
                    position: 'fixed', // 화면 전체를 덮도록 
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    zIndex: 500,
                },
                content: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none',
                    background: 'none',
                    width: '100vw',
                    height: '100vh',
                    padding: 0,
                    zIndex: 501,
                    inset: 0, // 모달을 화면 전체에 꽉 채우도록
                },
            }}>
            {/* 모달 헤더 */}
            <div className="absolute top-0 flex flex-row items-center justify-end w-full p-3 text-zinc-50">
                <div
                    className='flex items-center justify-center w-8 h-8 p-1 mr-1 rounded-md hover:bg-zinc-50 hover:text-black duration-150 cursor-pointer'
                    ref={downloadRef}
                    onClick={() => downloadFile(href, download, dispatch)}>
                    <DownloadIcon width="20" />
                </div>
                <button
                    className='flex items-center justify-center w-8 h-8 mr-1 p-1 rounded-md hover:bg-zinc-50 hover:text-black duration-150'
                    onClick={() => setIsModalOpen(false)}>
                    <CloseIcon width="15" />
                </button>
            </div>
            {/* 요소 컨테이너 */}
            <div
                ref={modalRef}
                className="flex justify-center items-center w-auto h-auto max-w-[90vw] max-h-[90vh] mt-4 overflow-hidden">
                {children}
            </div>
        </Modal>
    );
}
