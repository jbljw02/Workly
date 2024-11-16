'use client';

import HorizontalDivider from '../editor/child/divider/HorizontalDivider';
import CommonButton from '../button/CommonButton';
import Link from 'next/link';

type InvalidAccessProps = {
    title: string;
    description: React.ReactNode;
    Icon: React.ElementType;
    iconWidth: string;
}

// 올바르지 않은 문서에 접근했거나 권한이 없는 문서에 접근했을 때 표시할 컴포넌트
export default function InvalidAccess({ title, description, Icon, iconWidth }: InvalidAccessProps) {
    return (
        <div className='flex flex-col justify-center items-center w-full h-screen'>
            <div className='flex flex-col w-auto pb-6'>
                <div className='flex flex-col items-center'>
                    <div className={`flex items-center justify-center mb-7`}>
                        <Icon width={iconWidth} />
                    </div>
                    <div className='font-semibold mb-4 text-2xl'>{title}</div>
                    <div className='text-base mb-5 text-neutral-600 text-center'>{description}</div>
                </div>
                <HorizontalDivider borderColor='border-neutral-300' />
                <div className='flex flex-row items-center justify-center mt-5 gap-4'>
                    <Link href="/contact">
                        <CommonButton
                            style={{
                                width: 'w-[94px]',
                                height: 'h-[42px]',
                                textSize: 'text-base',
                                textColor: 'text-black',
                                bgColor: 'bg-white',
                                hover: 'hover:bg-gray-100'
                            }}
                            label="문의하기" />
                    </Link>
                    <Link href="/editor/home">
                        <CommonButton
                            style={{
                                width: 'w-[175px]',
                                height: 'h-[42px]',
                                textSize: 'text-base',
                                textColor: 'text-white',
                                bgColor: 'bg-black',
                                hover: 'hover:bg-zinc-800'
                            }}
                            label="내 콘텐츠로 돌아가기" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
