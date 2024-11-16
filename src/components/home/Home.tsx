'use client';

import CommonButton from '../button/CommonButton';
import Header from './child/Header';
import Footer from './child/Footer';
import logout from '@/utils/logout';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col flex-grow justify-between w-full min-h-screen">
            <div className='mx-64 flex-grow h-full'>
                <Header />
                <div className='py-28'>
                    <div className='font-extrabold text-6xl mb-4 text-black'>
                        <div>모든 것을 기록하고, 정리하고,</div>
                        <div className='mt-1.5'>공유하세요</div>
                    </div>
                    <div className='text-xl mb-7'>
                        문서를 작성하고, 팀원들과 실시간으로 공유해보세요.
                    </div>
                    <div className='flex flex-row items-center gap-5 mb-20'>
                        <Link href="/signup">
                            <CommonButton
                                style={{
                                    px: 'px-8',
                                    py: 'py-4',
                                    textSize: 'text-xl',
                                    textColor: 'text-white',
                                    bgColor: 'bg-black',
                                    hover: 'hover:scale-105'
                                }}
                                label="Workly 시작하기" />
                        </Link>
                        <Link href="/contact">
                            <CommonButton
                                style={{
                                    px: 'px-8',
                                    py: 'py-4',
                                    textSize: 'text-xl',
                                    textColor: 'text-black',
                                    bgColor: 'bg-white',
                                    hover: 'hover:scale-105'
                                }}
                                label="문의 남기기" />
                        </Link>
                    </div>
                    <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
                        <Image src="/pngs/editor-home.png" alt="home-image" width={1000} height={1000} layout='responsive' />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}