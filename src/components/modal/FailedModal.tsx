import Modal from 'react-modal';
import ModalHeader from './ModalHeader';
import CommonInput from '../input/CommonInput';
import SubmitButton from '../button/SubmitButton';
import CommonButton from '../button/CommonButton';
import { ModalProps } from '@/types/modalProps';
import useGetUserData from '../hooks/useGetUserData';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFailedAlert } from '@/redux/features/alertSlice';
import ErrorIcon from '../../../public/svgs/wifi-error.svg';
import InvalidAccess from '../invalid-access/InvalidAccess';
import HorizontalDivider from '../editor/child/divider/HorizontalDivider';
import Link from 'next/link';
import { setWorkingSpinner } from '@/redux/features/placeholderSlice';

export default function FailedModal() {
    const dispatch = useAppDispatch();
    const getUserData = useGetUserData();

    const retry = async () => {
        try {
            dispatch(setWorkingSpinner(true));
            await getUserData();

            // 성공적으로 데이터 로드 시 실패 상태를 false로 변경
            dispatch(setFailedAlert(false));
        } catch (error) {
            // 데이터를 불러오지 못하면 실패 상태는 계속 true
            dispatch(setFailedAlert(true));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    const failedAlert = useAppSelector(state => state.failedAlert);
    return (
        <Modal
            isOpen={failedAlert}
            onRequestClose={() => dispatch(setFailedAlert(false))}
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
                    height: 'fit-content',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                }
            }}>
            <div className='flex flex-col justify-center items-center w-full h-full py-10 px-10'>
                <div className='flex flex-col items-center'>
                    <div className={`flex items-center justify-center mb-7`}>
                        <ErrorIcon
                            className='text-red-500'
                            width="75" />
                    </div>
                    <div className='font-semibold mb-4 text-2xl'>데이터 로드 실패</div>
                    <div className='text-base mb-5 text-neutral-600 text-center'>
                        죄송합니다. 일시적인 에러로 사용자 정보를 불러오지 못했습니다.
                        <br />
                        해당 문제가 지속된다면 '문의하기'를 통해 문의해주세요.
                    </div>
                </div>
                <div className='flex flex-row items-center justify-center mt-5 gap-4'>
                    <Link href="/contact">
                        <CommonButton
                            style={{
                                width: 'w-[150px]',
                                height: 'h-[45px]',
                                textSize: 'text-base',
                                textColor: 'text-black',
                                bgColor: 'bg-white',
                                hover: 'hover:bg-gray-100'
                            }}
                            label="문의하기" />
                    </Link>
                    <Link href="/editor/home">
                        <SubmitButton
                            style={{
                                width: 'w-[250px]',
                                height: 'h-[45px]',
                                textSize: 'text-base',
                                textColor: 'text-white',
                                bgColor: 'bg-black',
                                hover: 'hover:bg-zinc-800'
                            }}
                            label="다시 시도"
                            onClick={retry}
                            value={true} />
                    </Link>
                </div>
            </div>
        </Modal>
    )
}