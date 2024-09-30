import CautionIcon from '../../../public/svgs/caution.svg'
import CloseIcon from '../../../public/svgs/editor/close.svg'
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { NoticeModalProps } from '@/types/noticeModalProps';

export default function WarningAlert({ isModalOpen, setIsModalOpen, label }: NoticeModalProps) {
    if (!isModalOpen) return null;

    const [animation, setAnimation] = useState<string>('slide-up');
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 애니메이션을 먼저 적용하고 툴팁을 닫음
        const timer = setTimeout(() => {
            setAnimation('slide-down');
            setTimeout(() => setIsModalOpen(false), 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [setIsModalOpen]);

    const closeTooltip = () => {
        setAnimation('slide-down');
        setTimeout(() => setIsModalOpen(false), 500);
    };

    useClickOutside(tooltipRef, () => closeTooltip());

    return (
        <div
            ref={tooltipRef}
            className={`${animation} fixed bottom-7 right-7 min-w-80 w-auto flex items-center p-4 rounded-lg text-yellow-900 bg-yellow-100 border border-yellow-200`}>
            <CautionIcon width="20" className="mr-3" />
            <div className="flex-grow text-sm font-medium">{label}</div>
            <button
                className='ml-3'
                onClick={closeTooltip}>
                <CloseIcon
                    width="15"
                    className="text-yellow-800 hover:text-yellow-600" />
            </button>
        </div>
    );
}