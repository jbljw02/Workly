import CloseIcon from '../../../public/svgs/editor/close.svg'
import { useEffect, useState } from "react";
import CompleteIcon from '../../../public/svgs/complete.svg';
import { NoticeModalProps } from '@/types/modalProps.type';

export default function CompleteAlert({ isModalOpen, setIsModalOpen, label }: NoticeModalProps) {
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
        // 애니메이션과 닫기를 동시에 하면 애니메이션을 볼 수 없으니,
        // 애니메이션을 먼저 적용한 후에 창을 닫음
        setAnimation('slide-down');
        setTimeout(() => setIsModalOpen(false), 500);
    };

    if (!isModalOpen) return null;

    return (
        <div className={`${animation} z-[503] fixed bottom-7 right-7 min-w-80 w-auto flex items-center p-4 rounded-lg text-white bg-gray-900 border border-gray-900`}>
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