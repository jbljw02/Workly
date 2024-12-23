'use client';

import HorizontalDivider from "../editor/child/divider/HorizontalDivider";
import ProfileSection from "./child/ProfileSection";
import AccountInfo from "./child/AccountInfo";
import AccountFooter from "./child/AccountFooter";
import HeaderButton from "../header/HeaderButton";
import { useAppSelector } from "@/redux/hooks";
import ProfileSectionSkeleton from "../placeholder/skeleton/ProfileSectionSkeleton";

export default function Account() {
    const user = useAppSelector(state => state.user);
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl p-4 space-y-10">
                {/* 뒤로가기 및 홈 버튼 */}
                <HeaderButton />
                {/* 프로필 섹션 */}
                {
                    user.email || user.displayName ?
                        <ProfileSection /> :
                        <ProfileSectionSkeleton />
                }
                {/* 계정 정보 섹션 */}
                <AccountInfo />
                <HorizontalDivider borderColor='border-gray-200' />
                {/* 탈퇴, 로그아웃 Footer */}
                <AccountFooter />
            </div>
        </div>
    )
}   