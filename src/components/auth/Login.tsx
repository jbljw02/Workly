'use client';

import Favicon from '../../../public/svgs/favicon.svg';
import { useState } from 'react';
import SubmitButton from '@/components/button/SubmitButton';
import CommonInput from '@/components/input/CommonInput';
import GoogleLoginButton from '@/components/button/GoogleLoginButton';
import HeaderButton from '@/app/header/HeaderButton';
import DivideBar from './DivideBar';
import AuthTop from './AuthTop';

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        isSubmitted: false, // 제출 됐는지 여부
    });

    const [isInvalidInfo, setIsInvalidInfo] = useState({
        isInvalid: false,
        msg: '이메일 혹은 비밀번호가 일치하지 않습니다',
    })

    return (
        <div className="flex w-full h-auto items-center justify-center">
            <HeaderButton />
            <div className='flex flex-col w-[450px] h-auto items-center justify-center mb-7 gap-8'>
                <AuthTop
                    title='로그인'
                    subtitle='Workly에서 계속해서 작업하세요.' />
                <form
                    className='flex flex-col gap-4 w-full'
                    noValidate>
                    <CommonInput
                        type="email"
                        value={formData.email}
                        setValue={(newEmail: string) => setFormData((prevState) => ({
                            ...prevState,
                            email: newEmail,
                        }))}
                        placeholder='이메일 주소'
                        isInvalidInfo={isInvalidInfo}
                        autoFocus={true} />
                    <CommonInput
                        type="password"
                        value={formData.password}
                        setValue={(newPassword: string) => setFormData((prevState) => ({
                            ...prevState,
                            password: newPassword,
                        }))}
                        placeholder='비밀번호'
                        isInvalidInfo={isInvalidInfo} />
                    <SubmitButton
                        style={{
                            px: '',
                            py: 'py-3.5',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-700'
                        }}
                        label="로그인"
                        value={formData.email && formData.password}
                        onClick={() => console.log("A")} />
                </form>
                {/* 로그인 영역과 SNS 로그인 영역을 구분하는 바 */}
                <DivideBar />
                {/* 구글 로그인 버튼 */}
                <GoogleLoginButton />
                {/* 하단 라벨 */}
                <div className='flex justify-between items-center text-sm w-full'>
                    <div className='flex flex-row gap-1.5'>
                        <div>아직 계정이 없으신가요?</div>
                        <button className='text-blue-600 underline'>가입</button>
                    </div>
                    <div className='flex flex-row gap-1.5'>
                        <div>비밀번호를 잊으셨나요?</div>
                        <button className='text-blue-600 underline'>찾기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}