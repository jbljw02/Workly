import { ModalProps } from '@/types/modalProps';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Modal from 'react-modal';
import CommonInput from '../../input/CommonInput';
import SubmitButton from '../../button/SubmitButton';
import CommonButton from '../../button/CommonButton';
import ModalHeader from '../ModalHeader';
import UserProfile from '../../aside/child/user/UserProfile';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import WebIcon from '../../../../public/svgs/web.svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { showCompleteAlert } from '@/redux/features/alertSlice';
import { useCopyURL } from '../../hooks/useCopyURL';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import fireStore from '../../../../firebase/firestore';
import { setSelectedDocument, updateDocuments } from '@/redux/features/documentSlice';
import axios from 'axios';
import { UserProps } from '@/redux/features/userSlice';
import PublishContent from './PublishContent';
import ShareContent from './ShareContent';

export default function ShareDocumentModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const dispatch = useAppDispatch();
    const { copyURL } = useCopyURL();

    const [targetEmail, setTargetEmail] = useState<string>(''); // 초대할 이메일
    const [workCategory, setWorkCategory] = useState<'공유' | '게시'>('공유');

    const closeModal = () => {
        setTargetEmail('');
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
                    top: '45%',
                    width: 600,
                    height: 440,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 49,
                    padding: 0,
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
                            <ShareContent
                                targetEmail={targetEmail}
                                setTargetEmail={setTargetEmail}
                                closeModal={closeModal} /> :
                            // 문서를 웹 페이지로 게시하는 영역
                            <PublishContent />
                    }
                </div>
                {/* 하단 버튼 영역 */}
                {
                    workCategory === '공유' ?
                        <div className='flex justify-end px- text-sm p-5 border-t'>
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
                                onClick={copyURL} />
                        </div> :
                        <div className='flex justify-center w-full text-sm p-5 border-t'>
                            <CommonButton
                                style={{
                                    px: 'px-[270px]',
                                    py: 'py-2',
                                    textSize: 'text-sm',
                                    textColor: 'text-white',
                                    bgColor: 'bg-blue-500',
                                    hover: 'hover:bg-blue-700',
                                }}
                                label="게시"
                                onClick={closeModal} />
                        </div>
                }
            </div>
        </Modal>
    )
}