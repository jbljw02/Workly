'use client';

import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import CommonButton from "../button/CommonButton";
import SubmitButton from "../button/SubmitButton";
import FormInput from "../input/FormInput";
import { useAppSelector } from "@/redux/hooks";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next-nprogress-bar";
import logout from "@/utils/logout";
import Image from "next/image";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { setUser } from "@/redux/features/userSlice";
import { setWorkingSpinner } from "@/redux/features/placeholderSlice";
import HorizontalDivider from "../editor/child/divider/HorizontalDivider";
import ProfileSection from "./child/ProfileSection";
import AccountInfo from "./child/AccountInfo";
import AccountFooter from "./child/AccountFooter";

export default function Account() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector(state => state.user);

    const [formData, setFormData] = useState({
        name: user.displayName,
        isSubmitted: false,
    });

    // 초기 formData 설정
    useEffect(() => {
        setFormData({
            ...formData,
            name: user.displayName,
        });
    }, [user.email]);


    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 유저 이름을 변경
    const updateUserName = async (event: { preventDefault: () => void; }) => {
        event.preventDefault(); // form의 기본 동작을 막음(조건이 만족해야 전송되도록)

        dispatch(setWorkingSpinner(true));

        // 제출 여부 true
        setFormData({
            ...formData,
            isSubmitted: true,
        });

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                await updateProfile(currentUser, {
                    displayName: formData.name,
                });
                dispatch(setUser({
                    ...user,
                    displayName: formData.name,
                }));
                dispatch(showCompleteAlert('사용자명을 성공적으로 변경했습니다.'));
            }
            else {
                dispatch(showWarningAlert('사용자명 변경에 실패했습니다.'));
            }
        } catch (error) {
            dispatch(showWarningAlert('사용자명 변경에 실패했습니다.'));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    return (
        <div className="flex w-full min-h-screen items-center justify-center bg-gray-50">
            <div className='w-[570px] bg-white rounded-2xl shadow-[0px_4px_10px_rgba(0,0,0,0.25)] p-10 space-y-10'>
                {/* 프로필 섹션 */}
                <ProfileSection />
                {/* 계정 정보 섹션 */}
                <AccountInfo />
                <HorizontalDivider borderColor='border-gray-200' />
                {/* 탈퇴, 로그아웃 Footer */}
                <AccountFooter />
            </div>
        </div>
    )
}   