'use client';

import { useRouter } from "next/navigation";
import CommonButton from "../button/CommonButton";

type DocumentHeaderProps = {
    title: string;
    description: string;
}

export default function DocumentHeader({ title, description }: DocumentHeaderProps) {
    const router = useRouter();
    return (
        <header className="flex flex-row justify-between items-start pt-10 px-12 pb-6 mb-5 gap-2">
            <div className="flex flex-col items-start gap-2">
                <div className="text-3xl font-semibold">{title}</div>
                <div className="pl-0.5 text-sm text-neutral-500">{description}</div>
            </div>
            <div className='flex flex-row pt-5 gap-3.5'>
                <CommonButton
                    style={{
                        px: 'px-4',
                        py: 'py-2',
                        textSize: 'text-sm',
                        textColor: 'text-black',
                        bgColor: 'bg-white',
                        hover: 'hover:bg-gray-100'
                    }}
                    label="새 문서"
                    onClick={() => console.log('문의 남기기')} />
                <CommonButton
                    style={{
                        px: 'px-4',
                        py: 'py-2',
                        textSize: 'text-sm',
                        textColor: 'text-white',
                        bgColor: 'bg-black',
                        hover: 'hover:bg-zinc-800'
                    }}
                    label="새 폴더"
                    onClick={() => router.push('/editor')} />
            </div>
        </header>
    )
}