import { useState } from 'react';
import Modal from 'react-modal';
import CommonButton from '../../button/CommonButton';
import ModalHeader from '../ModalHeader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import PublishContent from './PublishContent';
import ShareContent from './ShareContent';
import SubmitButton from '@/components/button/SubmitButton';
import copyURL from '@/utils/editor/copyURL';
import useCancelPublish from '@/hooks/document/useCancelPublish';
import useOverlayLock from '@/hooks/common/useOverlayLock';
import usePublishDocument from '@/hooks/document/usePublishDocument';
import { setTargetSharingEmail } from '@/redux/features/document/shareDocumentSlice';
import { WorkingDocModalProps } from '@/types/modalProps.type';
import useCheckDemo from '@/hooks/demo/useCheckDemo';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ShareDocumentModal({ isModalOpen, setIsModalOpen, selectedDoc }: WorkingDocModalProps) {
    const dispatch = useAppDispatch();

    const cancelPublish = useCancelPublish();
    const publishDocument = usePublishDocument();
    const checkDemo = useCheckDemo();

    const editorPermission = useAppSelector(state => state.editorPermission);

    const [workCategory, setWorkCategory] = useState<'공유' | '게시'>('공유');

    const closeModal = () => {
        dispatch(setTargetSharingEmail(''));
        setIsModalOpen(false);
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
                    top: '48%',
                    width: 600,
                    height: 'fit-content', // h-auto와 같이 크기에 맞춰서 height 조절
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                    overflow: 'hidden',
                }
            }}>
            <div
                className='flex flex-col h-full justify-between'>
                <div>
                    <ModalHeader
                        label="공유"
                        closeModal={closeModal} />
                    {/* 작업을 분기시키는 NavBar */}
                    <div className='flex flex-row items-center w-full justify-between text-sm border-b text-neutral-400 mb-7 cursor-pointer'>
                        <div
                            onClick={() => setWorkCategory('공유')}
                            className={`flex-1 text-center pt-2 pb-3 
                            ${workCategory === '공유' ? 'border-b-2 border-black text-black font-semibold' : ''}`}>
                            다른 사용자와 공유
                        </div>
                        <div
                            onClick={() => setWorkCategory('게시')}
                            className={`flex-1 text-center pt-2 pb-3 
                            ${workCategory === '게시' ? 'border-b-2 border-black text-black font-semibold' : ''}`}>
                            웹 페이지로 게시
                        </div>
                    </div>
                    {/* 작업 영역 */}
                    {
                        workCategory === '공유' ?
                            // 다른 사용자의 이메일을 입력하고 초대를 전송하는 영역
                            <ShareContent selectedDoc={selectedDoc} /> :
                            // 문서를 웹 페이지로 게시하는 영역
                            <PublishContent />
                    }
                </div>
                {/* 하단 버튼 영역 */}
                {
                    workCategory === '공유' ?
                        <div className='flex items-center justify-end w-full text-sm p-5 border-t'>
                            <CommonButton
                                style={{
                                    width: 'w-20',
                                    height: 'h-9',
                                    textSize: 'text-sm',
                                    textColor: 'text-white',
                                    bgColor: 'bg-blue-500',
                                    hover: 'hover:bg-blue-600',
                                }}
                                label="링크 복사"
                                onClick={() => copyURL(`${baseURL}/editor/${selectedDoc.folderId}/${selectedDoc.id}`, dispatch)}
                                disabled={checkDemo()} />
                        </div> :
                        <div className='flex items-center justify-center w-full text-sm p-5 border-t'>
                            <SubmitButton
                                style={{
                                    width: 'w-full',
                                    height: 'h-9',
                                    textSize: 'text-sm',
                                    textColor: 'text-white',
                                    bgColor: 'bg-blue-500',
                                    hover: 'hover:bg-blue-600',
                                }}
                                label={`${selectedDoc.isPublished ? '게시 취소' : '게시'}`}
                                onClick={() => selectedDoc.isPublished ?
                                    cancelPublish(selectedDoc.id) :
                                    publishDocument(selectedDoc)}
                                value={editorPermission === '전체 허용' && !checkDemo()} />
                        </div>
                }
            </div>
        </Modal>
    )
}