'use client';

import Header from './child/Header';
import Footer from './child/Footer';
import HeroSection from './child/HeroSection';
import FeaturesSection from './child/FeaturesSection';
import UseCaseSection from './child/UseCaseSection';
import CTASection from './child/CTASection';

export default function Home() {
    return (
        <div className="flex flex-col flex-grow justify-between w-full min-h-screen">
            <div className='mx-64 flex-grow h-full'>
                <Header />
                {/* 히어로 영역(첫 화면) */}
                <HeroSection />
                {/* 주요 기능 소개 영역 */}
                <FeaturesSection />
                {/* 사용 사례 영역 */}
                <UseCaseSection />
            </div>
            {/* CTA(Call To Action) 영역 */}
            <CTASection />
            <Footer />
        </div>
    )
}