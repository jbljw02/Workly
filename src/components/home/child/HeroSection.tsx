import CommonButton from "@/components/button/CommonButton";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <div className='pt-28 pb-24'>
            <div className='font-extrabold text-6xl mb-4 text-black'>
                <div>모든 것을 기록하고, 정리하고,</div>
                <div className='mt-1.5'>공유하세요</div>
            </div>
            <div className='text-xl mb-7 text-gray-600'>
                문서를 작성하고, 팀원들과 실시간으로 공유해보세요.
            </div>
            <div className='flex flex-row items-center gap-5 mb-20'>
                <Link href="/signup">
                    <CommonButton
                        style={{
                            width: 'w-52',
                            height: 'h-[62px]',
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
                            width: 'w-40',
                            height: 'h-[62px]',
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
    );
}