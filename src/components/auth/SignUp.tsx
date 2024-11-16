'use client';

import HeaderButton from "@/app/header/HeaderButton";
import { useMemo, useState } from "react";
import GoogleLoginButton from "../button/GoogleLoginButton";
import SubmitButton from "../button/SubmitButton";
import FormInput from "../input/FormInput";
import AuthTop from "./AuthTop";
import DivideBar from "./DivideBar";
import PINoticeModal from "../button/PINoticeModal";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebasedb";
import EmailVerifyModal from "../modal/EmailVerifyModal";
import { FirebaseError } from "firebase-admin";
import Link from "next/link";

export const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}$/;
export const pwdRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAgreeForPersonalInfo: false,
        isSubmitted: false, // 제출 됐는지 여부
    });

    const [emailInvalid, setEmailInvalid] = useState({
        isInvalid: false,
        msg: '',
    });

    const [passwordInvalid, setPasswordInvalid] = useState({
        isInvalid: false,
        msg: '비밀번호는 6자 이상, 최소 한 개의 특수문자를 포함해야 합니다',
    });
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState({
        isInvalid: false,
        msg: '비밀번호가 일치하지 않습니다',
    });

    const [isPIModalOpen, setIsPIModalOpen] = useState(false);
    const [isVibrate, setIsVibrate] = useState(false);
    const [emailVerifyModal, setEmailVerifyModal] = useState(false);

    // 개인정보 처리방침 동의 토글
    const checkPICheckBox = () => {
        setFormData((prevState) => ({
            ...prevState,
            isAgreeForPersonalInfo: !prevState.isAgreeForPersonalInfo,
        }));
    }

    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // 폼이 1회 이상 제출됐을 시에만
        if (formData.isSubmitted) {
            // 이메일이 정규식을 따르고 있는지 검사
            if (e.target.name === 'email') {
                if (emailRegex.test(e.target.value)) {
                    setEmailInvalid({
                        msg: '',
                        isInvalid: false,
                    });
                }
                else {
                    setEmailInvalid({
                        msg: '유효하지 않은 이메일입니다',
                        isInvalid: true,
                    });
                }
            }
            // 비밀번호가 정규식을 따르고 있는지 검사
            if (e.target.name === 'password') {
                if (pwdRegex.test(e.target.value)) {
                    setPasswordInvalid((prevState) => ({
                        ...prevState,
                        isInvalid: false,
                    }));
                }
                else {
                    setPasswordInvalid((prevState) => ({
                        ...prevState,
                        isInvalid: true,
                    }));
                }
            }
        }
    };

    const formSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // form의 기본 동작을 막음(조건이 만족해야 전송되도록)

        // 제출 여부 true
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
        }

        // 비밀번호가 정규식을 따르지 않을 경우
        if (!pwdRegex.test(formData.password)) {
            setPasswordInvalid((prevState) => ({
                ...prevState,
                isInvalid: true,
            }));
        }
        // 정규식을 따른다면, 그 뒤엔 비밀번호 확인과 일치하는지 검사
        else {
            if (formData.password !== formData.confirmPassword) {
                setConfirmPasswordInvalid((prevState) => ({
                    ...prevState,
                    isInvalid: true,
                }));
            }
            else {
                setConfirmPasswordInvalid((prevState) => ({
                    ...prevState,
                    isInvalid: false,
                }));
            }
        }

        // 개인정보 처리방침에 동의하지 않았을 경우 진동 효과
        if (!formData.isAgreeForPersonalInfo) {
            setIsVibrate(true);
            setTimeout(() => {
                setIsVibrate(false);
            }, 1000);

            return;
        }

        /* 
            1. 공란이 없어야 함
            2. 비밀번호와 비밀번호 확인란이 일치해야 함
            3. 개인정보 처리방침에 동의해야 함
            4. 이메일과 비밀번호가 정규식을 따라야 함
            5. 이메일이 이미 존재하지 않아야 함
        */
        if (formData.name &&
            formData.email &&
            formData.password &&
            formData.password === formData.confirmPassword &&
            formData.isAgreeForPersonalInfo &&
            !emailInvalid.isInvalid &&
            !passwordInvalid.isInvalid &&
            !confirmPasswordInvalid.isInvalid) {
            signUp();
        }
        else {
            console.log("불만족");
        }
    }

    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: formData.name, // formData.name을 displayName으로 설정
            });

            // 이메일을 전송한 후,
            await sendEmailVerification(user);

            // 이메일 인증 여부를 확인하는 모달을 띄움
            setEmailVerifyModal(true);
        }
        catch (error) {
            // 이미 사용중인 이메일
            if ((error as FirebaseError).code === 'auth/email-already-in-use') {
                setEmailInvalid({
                    msg: '이미 존재하는 이메일입니다',
                    isInvalid: true,
                });
            }
            else {
                throw error;
            }
        }
    }


    return (
        <div className="flex w-full min-h-screen items-center justify-center">
            <HeaderButton />
            <div className='flex flex-col w-[450px] h-full items-center justify-center mb-7 gap-8'>
                <AuthTop
                    title='회원가입'
                    subtitle='Workly에 오신 것을 환영합니다!' />
                <form
                    className='flex flex-col gap-4 w-full'
                    onSubmit={formSubmit}
                    noValidate>
                    <FormInput
                        type="text"
                        name="name"
                        value={formData.name}
                        setValue={formChange}
                        placeholder='이름'
                        autoFocus={true} />
                    <FormInput
                        type="email"
                        name="email"
                        value={formData.email}
                        setValue={formChange}
                        placeholder='이메일 주소'
                        isInvalidInfo={emailInvalid} />
                    <FormInput
                        type="password"
                        name="password"
                        value={formData.password}
                        setValue={formChange}
                        placeholder='비밀번호'
                        isInvalidInfo={passwordInvalid} />
                    <FormInput
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        setValue={formChange}
                        placeholder='비밀번호 확인'
                        isInvalidInfo={confirmPasswordInvalid} />
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
                        value={formData.name && formData.email && formData.password && formData.confirmPassword} />
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
                            className="cursor-pointer"
                            onChange={checkPICheckBox}
                            checked={formData.isAgreeForPersonalInfo} />
                        <div>
                            <button
                                onClick={() => setIsPIModalOpen(true)}
                                className={`underline 
                                ${isVibrate && 'vibrate'} 
                                ${(formData.isSubmitted && !formData.isAgreeForPersonalInfo) && 'text-red-500'}`}>개인정보 처리방침</button>
                            에 동의합니다.
                        </div>
                    </div>
                    <div className='flex flex-row gap-1.5'>
                        <div>이미 계정이 있으신가요?</div>
                        <Link
                            href="/login"
                            className="text-blue-600 underline">
                                로그인
                        </Link>
                    </div>
                </div>
                <PINoticeModal
                    isModalOpen={isPIModalOpen}
                    setIsModalOpen={setIsPIModalOpen}
                    setIsAgree={() => setFormData((prevState) => ({
                        ...prevState,
                        isAgreeForPersonalInfo: true,
                    }))}
                    category="회원가입" />
                <EmailVerifyModal
                    isModalOpen={emailVerifyModal}
                    setIsModalOpen={setEmailVerifyModal} />
            </div>
        </div>
    )
}