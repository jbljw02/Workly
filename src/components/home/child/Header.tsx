'use client';

import CommonButton from '@/components/button/CommonButton';
import LogoIcon from '../../../../public/svgs/logo.svg';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex flex-row items-center justify-between py-8 w-full h-auto">
            <Link
                href="/"
                className="text-2xl font-semibold cursor-pointer">
                <LogoIcon
                    width="155" />
            </Link>
            <div className="flex flex-row items-center gap-3">
                <Link
                    href="/login"
                    className='flex-shrink-0 rounded px-3 py-1.5 hover:bg-gray-100'>
                    로그인
                </Link>
                <Link href="/signup">
                    <CommonButton
                        style={{
                            width: 'w-[150px]',
                            height: 'h-11',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                            hover: 'hover:scale-105'
                        }}
                        label="Workly 시작하기" />
                </Link>
            </div>
        </header>
    )
}