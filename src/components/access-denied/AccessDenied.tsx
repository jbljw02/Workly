'use client';

import { useRouter } from 'next/navigation';
import DeniedIcon from '../../../public/svgs/denied.svg';
import HorizontalDivider from '../editor/child/divider/HorizontalDivider';
import CommonButton from '../button/CommonButton';

export default function AccessDenied() {
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center items-center w-full h-screen'>
            <div className='flex flex-col items-center w-auto pb-6'>
                <DeniedIcon width="110" />
                <div className='font-semibold mb-4 text-2xl'>접근 권한이 없음</div>
                <div className='text-base mb-5 text-neutral-600 text-center'>
                    현재 페이지에 대한 접근 권한이 없습니다.
                    <br />
                    페이지의 관리자에게 권한을 요청해주세요.
                </div>
                <HorizontalDivider borderColor='border-neutral-300' />
                <div className='flex flex-row items-center justify-center mt-5 gap-4'>
                    <CommonButton
                        style={{
                            px: 'px-4',
                            py: 'py-2',
                            textSize: 'text-base',
                            textColor: 'text-black',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-100'
                        }}
                        label="문의하기"
                        onClick={() => router.push('/contact')} />
                    <CommonButton
                        style={{
                            px: 'px-4',
                            py: 'py-2',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                            hover: 'hover:bg-zinc-800'
                        }}
                        label="내 콘텐츠로 돌아가기"
                        onClick={() => router.push('/editor/home')} />
                </div>
            </div>
        </div>
    )
}
