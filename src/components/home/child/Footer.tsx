'use client';

import LogoIcon from '../../../../public/svgs/logo.svg';
import GithubIcon from '../../../../public/svgs/github.svg';
import { useRouter } from 'next/navigation';

export default function Footer() {
    const router = useRouter();

    return (
        <div className="flex flex-row justify-between border-t border-gray-200 px-64 pt-8 pb-9 w-full">
            {/* Footer 좌측 */}
            <div className='flex flex-col gap-2 h-full'>
                <LogoIcon
                    onClick={() => router.push('/')}
                    className="cursor-pointer"
                    width="120" />
                <div className='text-sm'>
                    ©2024 by Workly. All Rights Reserved.
                </div>
            </div>
            {/* Footer 우측 */}
            <div className='flex flex-col h-full'>
                <button className='flex justify-start mt-2 items-center gap-2 group cursor-pointer'>
                    <GithubIcon
                        className='text-black group-hover:text-gray-600'
                        width="22" />
                    <div className='text-sm group-hover:underline'>
                        Workly&apos;s Github
                    </div>
                </button>
                <div className='flex flex-row gap-3 mt-auto text-sm'>
                    <button className='hover:underline'>쿠키 설정</button>
                    <button className='hover:underline'>개인정보 처리방침</button>
                </div>
            </div>
        </div>
    )
}