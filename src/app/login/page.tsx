'use client';

import Favicon from '../../../public/svgs/favicon.svg';
import { useState } from 'react';
import SubmitButton from '@/components/button/SubmitButton';
import GoogleIcon from '../../../public/svgs/google.svg';
import HorizontalDivider from '@/components/editor/child/divider/HorizontalDivider';
import CommonInput from '@/components/input/CommonInput';

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        isSubmitted: false, // 제출 됐는지 여부
    });

    const [isInvalidInfo, setIsInvalidInfo] = useState({
        isInvalid: false,
        msg: '이메일을 혹은 비밀번호가 일치하지 않습니다',
    })

    return (
        <div className="flex w-full h-auto items-center justify-center">
            <div className='flex flex-col w-[450px] h-auto items-center justify-center gap-8'>
                <div className='flex flex-col w-full items-center mb-4'>
                    <Favicon width="70" />
                    <div className='text-3xl font-semibold mt-6'>로그인</div>
                    <div className='text-[15px] mt-2'>Workly에서 계속해서 작업하세요.</div>
                </div>
                <form className='flex flex-col gap-4 w-full'>
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
                <div className="flex items-center justify-center w-full">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <span className="px-4 text-gray-400 text-sm">또는</span>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>
                <div className='flex w-full'>
                    <div className='flex items-center justify-center py-2.5 gap-1 rounded-lg border border-gray-400 w-full'>
                        <GoogleIcon />
                        <div>구글 계정으로 로그인</div>
                    </div>
                </div>
                <div className='flex justify-between items-center text-sm w-full'>
                    <div className='flex flex-row gap-1.5'>
                        <div>계정이 없으신가요?</div>
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