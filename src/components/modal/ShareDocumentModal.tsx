import { ModalProps } from '@/types/modalProps';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import CommonInput from '../input/CommonInput';
import SubmitButton from '../button/SubmitButton';
import CommonButton from '../button/CommonButton';
import ModalHeader from './ModalHeader';
import UserProfile from '../aside/child/user/UserProfile';
import ArrowIcon from '../../../public/svgs/down-arrow.svg';
import WebIcon from '../../../public/svgs/web.svg';

type ShareContentProps = {
    targetEmail: string;
    setTargetEmail: React.Dispatch<React.SetStateAction<string>>;
    closeModal: () => void;
}

// 다른 사용자의 이메일을 입력하고 초대를 전송하는 영역
function ShareContent({ targetEmail, setTargetEmail, closeModal }: ShareContentProps) {
    return (
        <>
            {/* 초대할 사용자의 이메일을 작성하고 초대를 전송하는 영역 */}
            < div className='flex flex-row items-center justify-between px-5 mb-7 gap-6' >
                <div className='w-[480px]'>
                    <CommonInput
                        type="text"
                        value={targetEmail}
                        setValue={setTargetEmail}
                        placeholder={'초대할 사용자의 이메일'}
                        autoFocus={true} />
                </div>
                <CommonButton
                    style={{
                        px: 'px-3.5',
                        py: 'py-2.5',
                        textSize: 'text-sm',
                        textColor: 'text-white',
                        bgColor: 'bg-blue-500',
                        hover: 'hover:bg-blue-700',
                    }}
                    label='초대'
                    onClick={closeModal} />
            </div >
            {/* 현재 문서에 접근 권한이 있는 사용자를 나열 */}
            < div className='flex flex-col px-5' >
                <div className='text-sm font-semibold mb-4'>접근 권한이 있는 사용자</div>
                <div className='flex flex-col gap-4 max-h-[120px] overflow-y-scroll scrollbar-thin'>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile />
                        <button className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-100'>
                            <div className='whitespace-nowrap text-sm'>전체 허용</div>
                            <ArrowIcon width="17" />
                        </button>
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile />
                        <button className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-100'>
                            <div className='whitespace-nowrap text-sm'>전체 허용</div>
                            <ArrowIcon width="17" />
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

// 웹 페이지로 게시하는 영역
function PublishContent() {
    return (
        <div className='flex flex-col items-center justify-center h-auto'>
            <WebIcon width="100" />
            <div className='font-semibold mt-4 mb-2 text-[17px]'>웹 페이지로 게시</div>
            <div className='text-sm text-neutral-600 text-center'>현재 문서로 웹 사이트를 생성합니다. <br />
                웹 사이트는 읽기 전용으로 생성되며, 누구나 접근할 수 있습니다.</div>
        </div>
    )
}

export default function ShareDocumentModal({ isModalOpen, setIsModalOpen }: ModalProps) {
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
                    width: 600,
                    height: 440,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                    padding: 0,
                }
            }}>
            <form
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
                            <ShareContent
                                targetEmail={targetEmail}
                                setTargetEmail={setTargetEmail}
                                closeModal={closeModal} /> :
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
                                onClick={closeModal} />
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
            </form>
        </Modal>
    )
}