'use client';

import HeaderButton from '../header/HeaderButton';
import ContactHeaderSection from './child/ContactHeaderSection';
import ContactForm from './child/ContactForm';

export default function Contact() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl p-4">
                {/* 뒤로가기 및 홈 버튼 */}
                <HeaderButton />
                {/* 제목과 부제목이 있는 영역 */}
                <ContactHeaderSection />
                {/* 폼 섹션 */}
                <ContactForm />
            </div>
        </div>
    );
}