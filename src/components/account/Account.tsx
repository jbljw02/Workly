'use client';

import HorizontalDivider from "../editor/child/divider/HorizontalDivider";
import ProfileSection from "./child/ProfileSection";
import AccountInfo from "./child/AccountInfo";
import AccountFooter from "./child/AccountFooter";
import HeaderButton from "../header/HeaderButton";

export default function Account() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl p-4 space-y-10">
                {/* 뒤로가기 및 홈 버튼 */}
                <HeaderButton />
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