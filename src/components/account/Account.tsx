'use client';

import HorizontalDivider from "../editor/child/divider/HorizontalDivider";
import ProfileSection from "./child/ProfileSection";
import AccountInfo from "./child/AccountInfo";
import AccountFooter from "./child/AccountFooter";

export default function Account() {
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