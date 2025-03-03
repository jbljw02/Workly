import CautionIcon from '../../../public/svgs/caution-circle.svg'
import CloseIcon from '../../../public/svgs/editor/close.svg'
import { useEffect, useState } from "react";
import { NoticeModalProps } from '@/types/modalProps.type';

export default function WarningAlert({ isModalOpen, setIsModalOpen, label }: NoticeModalProps) {
    const [animation, setAnimation] = useState<string>('slide-up');

    useEffect(() => {
        if (isModalOpen) {
            setAnimation('slide-up');
            const timer = setTimeout(() => {
                closeTooltip();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isModalOpen, label]);

    const closeTooltip = () => {
        setAnimation('slide-down');
        setTimeout(() => setIsModalOpen(false), 500);
    };

    if (!isModalOpen) return null;

    return (
        <div
            className={`${animation} z-[503] fixed bottom-7 right-7 min-w-80 w-auto flex items-center p-4 rounded-lg text-yellow-900 bg-yellow-100 border border-yellow-200`}>
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