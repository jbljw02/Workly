'use client';

import { useState } from 'react';
import SubmitButton from '@/components/button/SubmitButton';
import GoogleLoginButton from '@/components/button/GoogleLoginButton';
import HeaderButton from '@/components/header/HeaderButton';
import DivideBar from './child/DivideBar';
import AuthTop from './child/AuthTop';
import FormInput from '../input/FormInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebasedb';
import { FirebaseError } from 'firebase/app';
import EmailVerifyModal from '../modal/EmailVerifyModal';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useAppDispatch } from '@/redux/hooks';
import { setWorkingSpinner } from '@/redux/features/common/placeholderSlice';
import getEmailToken from '@/utils/auth/getEmailToken';

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isSubmitted: false, // 제출 됐는지 여부
    });

    const [isInvalidInfo, setIsInvalidInfo] = useState({
        isInvalid: false,
        msg: '이메일 혹은 비밀번호가 일치하지 않습니다',
    })
    const [emailVerifiedFail, setEmailVerifiedFail] = useState(false);

    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const formSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // form의 기본 동작을 막음(조건이 만족해야 전송되도록)

        // 제출 여부 true
        setFormData((prevState) => ({
            ...prevState,
            isSubmitted: true,
        }));

        if (formData.email &&
            formData.password) {
            login();
        }
    }

    const login = async () => {
        try {
            dispatch(setWorkingSpinner(true));

            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = auth.currentUser;

            // 로그인된 사용자의 이메일 인증 여부 확인
            if (user) {
                setIsInvalidInfo((prevState) => ({
                    ...prevState,
                    isInvalid: false,
                }))

                if (user && user.emailVerified) {
                    setEmailVerifiedFail(false);
                    await getEmailToken();

                    router.push('/editor/home');
                }
                // 이메일 인증이 완료되지 않았을 경우, 인증 모달 팝업
                else {
                    setEmailVerifiedFail(true);
                }
            }
        }
        catch (error) {
            if (error instanceof FirebaseError) {
                setIsInvalidInfo((prevState) => ({
                    ...prevState,
                    isInvalid: true,
                }))
            }
        }
        finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
            <HeaderButton />
            <div className='flex flex-col w-[450px] h-full items-center justify-center mb-7 gap-8'>
                <AuthTop
                    title='로그인'
                    subtitle='Workly에서 계속해서 작업하세요.' />
                <form
                    className='flex flex-col gap-4 w-full'
                    onSubmit={formSubmit}
                    noValidate>
                    <FormInput
                        type="email"
                        name="email"
                        value={formData.email}
                        setValue={formChange}
                        placeholder='이메일 주소'
                        isInvalidInfo={{
                            isInvalid: isInvalidInfo.isInvalid,
                            msg: null,
                        }}
                        autoFocus={true} />
                    <FormInput
                        type="password"
                        name="password"
                        value={formData.password}
                        setValue={formChange}
                        placeholder='비밀번호'
                        isInvalidInfo={isInvalidInfo} />
                    <SubmitButton
                        style={{
                            width: 'w-full',
                            height: 'h-[52px]',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-600'
                        }}
                        label="로그인"
                        value={formData.email && formData.password} />
                </form>
                {/* 로그인 영역과 SNS 로그인 영역을 구분하는 바 */}
                <DivideBar />
                {/* 구글 로그인 버튼 */}
                <GoogleLoginButton />
                {/* 하단 라벨 */}
                <div className='flex justify-between items-center text-sm w-full'>
                    <div className='flex flex-row gap-1.5'>
                        <div>아직 계정이 없으신가요?</div>
                        <Link
                            href="/signup"
                            className='text-blue-600 underline'>회원가입</Link>
                    </div>
                    <div className='flex flex-row gap-1.5'>
                        <div>비밀번호를 잊으셨나요?</div>
                        <Link
                            href="/reset-password"
                            className='text-blue-600 underline'>찾기</Link>
                    </div>
                </div>
                <EmailVerifyModal
                    isModalOpen={emailVerifiedFail}
                    setIsModalOpen={setEmailVerifiedFail} />
            </div>
        </div>
    )
}