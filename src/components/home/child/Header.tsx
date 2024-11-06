'use client';

import CommonButton from '@/components/button/CommonButton';
import LogoIcon from '../../../../public/svgs/logo.svg';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    return (
        <header className="flex flex-row items-center justify-between py-8 w-full h-auto">
            <div className="text-2xl font-semibold cursor-pointer">
                <LogoIcon
                    onClick={() => router.push('/')}
                    width="155" />
            </div>
            <div className="flex flex-row items-center gap-3">
                <button
                    onClick={() => router.push('/login')}
                    className='flex-shrink-0 rounded px-3 py-1.5 hover:bg-gray-100'>
                    로그인
                </button>
                <CommonButton
                    style={{
                        px: 'px-4',
                        py: 'py-2',
                        textSize: 'text-base',
                        textColor: 'text-white',
                        bgColor: 'bg-black',
                        hover: 'hover:scale-105'
                    }}
                    label="Workly 시작하기"
                    onClick={() => router.push('/signup')} />
            </div>
        </header>
    )
}