import CloseIcon from '../../../public/svgs/editor/close.svg'
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import CompleteIcon from '../../../public/svgs/write/task.svg';
import { NoticeModalProps } from '@/types/noticeModalProps';

export default function CompleteAlert({ isModalOpen, setIsModalOpen, label }: NoticeModalProps) {
    const [animation, setAnimation] = useState<string>('slide-up');
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isModalOpen) {
            setAnimation('slide-up');
            // 창을 열고 3초 뒤에 닫음
            const timer = setTimeout(() => {
                closeTooltip();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    const closeTooltip = () => {
        // 애니메이션과 닫기를 동시에 하면 애니메이션을 볼 수 없으니,
        // 애니메이션을 먼저 적용한 후에 창을 닫음
        setAnimation('slide-down');
        setTimeout(() => setIsModalOpen(false), 500);
    };

    useClickOutside(tooltipRef, closeTooltip);

    if (!isModalOpen) return null;

    return (
        <div
            ref={tooltipRef}
            className={`${animation} z-50 fixed bottom-7 right-7 min-w-80 w-auto flex items-center p-4 rounded-lg text-white bg-gray-900 border border-gray-900`}>
            <CompleteIcon width="20" className="mr-3 text-white" />
            <div className="flex-grow text-sm font-medium">{label}</div>
            <button
                className='ml-3'
                onClick={closeTooltip}>
                <CloseIcon
                    width="15"
                    className="text-white hover:text-gray-400" />
            </button>
        </div>
    );
}