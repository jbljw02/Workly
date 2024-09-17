'use client';

import HeaderButton from "@/app/header/HeaderButton";
import { useState } from "react";
import GoogleLoginButton from "../button/GoogleLoginButton";
import SubmitButton from "../button/SubmitButton";
import CommonInput from "../input/CommonInput";
import AuthTop from "./AuthTop";
import DivideBar from "./DivideBar";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        emailValid: false,
        password: '',
        confirmPassword: '',
        isAgreeForPersonalInfo: false,
        isSubmitted: false, // 제출 됐는지 여부
    });

    const [isInvalidInfo, setIsInvalidInfo] = useState({
        isInvalid: false,
        msg: '이메일을 혹은 비밀번호가 일치하지 않습니다',
    })

    return (
        <div className="flex w-full h-auto items-center justify-center">
            <HeaderButton />
            <div className='flex flex-col w-[450px] h-auto items-center justify-center mb-7 gap-8'>
                <AuthTop
                    title='회원가입'
                    subtitle='Workly에 오신 것을 환영합니다!' />
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
                    <CommonInput
                        type="password"
                        value={formData.confirmPassword}
                        setValue={(newPassword: string) => setFormData((prevState) => ({
                            ...prevState,
                            confirmPassword: newPassword,
                        }))}
                        placeholder='비밀번호 확인'
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
                        label="회원가입"
                        value={formData.email && formData.password && formData.confirmPassword}
                        onClick={() => console.log("A")} />
                </form>
                {/* 로그인 영역과 SNS 로그인 영역을 구분하는 바 */}
                <DivideBar />
                {/* 구글 로그인 버튼 */}
                <GoogleLoginButton />
                {/* 하단 라벨 */}
                <div className='flex justify-between items-center text-sm w-full'>
                    <div className="flex flex-row gap-1.5">
                        <input
                            type="checkbox"
                            className="cursor-pointer" />
                        <div>
                            <button className="underline">개인정보 처리방침</button>
                            에 동의합니다.
                        </div>
                    </div>
                    <div className='flex flex-row gap-1.5'>
                        <div>이미 계정이 있으신가요?</div>
                        <button
                            onClick={() => router.push('/login')}
                            className='text-blue-600 underline'>로그인</button>
                    </div>
                </div>
            </div>
        </div>
    )
}