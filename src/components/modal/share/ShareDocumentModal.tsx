import { useState } from 'react';
import Modal from 'react-modal';
import CommonInput from '../../input/CommonInput';
import CommonButton from '../../button/CommonButton';
import ModalHeader from '../ModalHeader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';
import { useCopyURL } from '../../hooks/useCopyURL';
import PublishContent from './PublishContent';
import ShareContent from './ShareContent';
import { setTargetSharingEmail } from '@/redux/features/shareDocumentSlice';
import { WorkingDocModalProps } from '@/types/workingDocModalProps';
import axios from 'axios';
import { publishContent } from '@/redux/features/documentSlice';
import useCancelPublish from '@/components/hooks/useCancelPublish';
import usePublishDocument from '@/components/hooks/usePublishDocument';

export default function ShareDocumentModal({ isModalOpen, setIsModalOpen, selectedDoc }: WorkingDocModalProps) {
    const dispatch = useAppDispatch();

    const copyURL = useCopyURL();
    const cancelPublish = useCancelPublish();
    const publishDocument = usePublishDocument();
    
    const editorPermission = useAppSelector(state => state.editorPermission);

    const [workCategory, setWorkCategory] = useState<'공유' | '게시'>('공유');

    const closeModal = () => {
        dispatch(setTargetSharingEmail(''));
        setIsModalOpen(false);
    }

    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 48,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '48%',
                    width: 600,
                    height: 'fit-content', // h-auto와 같이 크기에 맞춰서 height 조절
                    transform: 'translate(-50%, -50%)',
                    zIndex: 49,
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
                                    px: 'px-3.5',
                                    py: 'py-2',
                                    textSize: 'text-sm',
                                    textColor: 'text-white',
                                    bgColor: 'bg-blue-500',
                                    hover: 'hover:bg-blue-700',
                                }}
                                label="링크 복사"
                                onClick={() => copyURL(selectedDoc.folderId, selectedDoc.id)} />
                        </div> :
                        <div className='flex items-center justify-center w-full text-sm p-5 border-t'>
                            <CommonButton
                                style={{
                                    px: `${selectedDoc.isPublished ? 'px-[255px]' : 'px-[270px]'}`,
                                    py: 'py-2',
                                    textSize: 'text-sm',
                                    textColor: 'text-white',
                                    bgColor: 'bg-blue-500',
                                    hover: 'hover:bg-blue-700',
                                }}
                                label={`${selectedDoc.isPublished ? '게시 취소' : '게시'}`}
                                onClick={() => selectedDoc.isPublished ? cancelPublish(selectedDoc.id) : publishDocument(selectedDoc)}
                                disabled={editorPermission !== '전체 허용'} />
                        </div>
                }
            </div>
        </Modal>
    )
}