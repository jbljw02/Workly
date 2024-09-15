'use client';

import { useRouter } from 'next/navigation';
import LogoIcon from '../../../public/svgs/logo.svg';
import CommonButton from '../button/CommonButton';
import Header from './child/Header';

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full mx-64">
            <Header />
            <div className='py-28'>
                <div className='font-extrabold text-6xl mb-4 text-black'>
                    모든 것을 기록하고, 정리하고, <br /> 공유하세요
                </div>
                <div className='text-xl mb-7'>
                    문서를 작성하고, 할 일과 일정을 정리하여 다른 사람과 공유해보세요.
                </div>
                <div className='flex flex-row items-center gap-5'>
                    <CommonButton
                        style={{
                            px: 'px-8',
                            py: 'py-4',
                            textSize: 'text-xl',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                        }}
                        label="Workly 시작하기"
                        onClick={() => router.push('/signup')} />
                    <CommonButton
                        style={{
                            px: 'px-8',
                            py: 'py-4',
                            textSize: 'text-xl',
                            textColor: 'text-black',
                            bgColor: 'bg-white',
                        }}
                        label="문의 남기기"
                        onClick={() => router.push('/contact')} />
                </div>
            </div>
        </div>
    )
}