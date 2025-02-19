'use client'

import { useState } from "react";
import HeaderButton from "../header/HeaderButton";
import FormInput from "../input/FormInput";
import SubmitButton from "../button/SubmitButton";
import { emailRegex } from "./SignUp";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebasedb";
import { useAppDispatch } from "@/redux/hooks";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { useRouter } from "next-nprogress-bar";

export default function ResetPassword() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        isSubmitted: false,
    });
    const [emailInvalid, setEmailInvalid] = useState({
        isInvalid: false,
        msg: '유효하지 않은 이메일입니다',
    });

    const [isSent, setIsSent] = useState(false);

    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'email' && formData.isSubmitted) {
            if (!emailRegex.test(value)) {
                setEmailInvalid({
                    msg: '유효하지 않은 이메일입니다',
                    isInvalid: true,
                });
            }
            else {
                setEmailInvalid({
                    msg: '',
                    isInvalid: false,
                });
            }
        }
    }

    const resetPassword = async () => {
        try {
            dispatch(setWorkingSpinner(true));

            await sendPasswordResetEmail(auth, formData.email);
            dispatch(showCompleteAlert('메일 수신함을 확인해주세요.'));
            setIsSent(true);
        }
        catch (error) {
            dispatch(showWarningAlert('이메일 전송에 실패했습니다.'));
            setIsSent(false);
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData((prevState) => ({
            ...prevState,
            isSubmitted: true,
        }));

        // 이메일이 정규식을 따르지 않을 경우
        if (!emailRegex.test(formData.email)) {
            setEmailInvalid({
                msg: '유효하지 않은 이메일입니다',
                isInvalid: true,
            });

            return;
        }

        if (formData.email && !emailInvalid.isInvalid) {
            resetPassword();
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-center">
            <HeaderButton />
            <div className="flex flex-col w-full max-w-xl h-full items-center justify-center mb-20 gap-7">
                <form
                    className='flex flex-col w-full h-full gap-6'
                    onSubmit={formSubmit}
                    noValidate>
                    <div className="flex flex-col w-full items-start">
                        <h1 className="text-3xl font-semibold mt-6">
                            Workly 계정의
                            <br />
                            비밀번호를 재생성합니다.
                        </h1>
                        <div className="text-[15px] mt-2">
                            비밀번호를 재설정할 계정의 이메일을 입력해주세요. 새 비밀번호를 생성할 수 있도록 <br /> 도와 드릴게요.
                            설정이 완료되면 새 비밀번호로 로그인이 가능합니다.
                        </div>
                    </div>
                    <FormInput
                        type="email"
                        name="email"
                        value={formData.email}
                        setValue={formChange}
                        placeholder='이메일 주소'
                        autoFocus={true}
                        isInvalidInfo={emailInvalid} />
                    <SubmitButton
                        style={{
                            width: 'w-full',
                            height: 'h-[52px]',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-700'
                        }}
                        label="비밀번호 재설정"
                        value={formData.email} />
                </form>
                {
                    isSent &&
                    <div className="flex flex-col w-full items-start gap-2 text-[15px] ml-2">
                        비밀번호 재설정을 위한 이메일을 전송해드렸어요. <br />
                        혹시 받지 못하셨나요?
                        <div className="flex flex-row items-start gap-4">
                            <button
                                onClick={resetPassword}
                                className="underline font-semibold hover:text-blue-500">
                                재전송
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className="underline font-semibold hover:text-blue-500">
                                로그인
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}