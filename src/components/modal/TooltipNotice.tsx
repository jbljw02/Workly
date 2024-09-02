import { NoticeModal } from "./NoticeModal";
import CautionIcon from '../../../public/svgs/caution.svg'
import CloseIcon from '../../../public/svgs/editor/close.svg'
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

export default function TooltipNotice({ isModalOpen, setIsModalOpen, label }: NoticeModal) {
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
            className={`${animation} absolute bottom-7 right-7 w-80 flex items-center p-4 rounded-lg text-yellow-900 bg-yellow-100 border border-yellow-200`}>
            <CautionIcon width="20" className="mr-3" />
            <div className="flex-grow text-sm font-medium">{label}</div>
            <button onClick={closeTooltip}>
                <CloseIcon
                    width="15"
                    className="text-yellow-800 hover:text-yellow-600" />
            </button>
        </div>
    );
}