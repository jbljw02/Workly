import CloseIcon from '../../../public/svgs/close.svg';
import { ReactNode } from 'react';

type ModalHeaderProps = {
    label: ReactNode;
    closeModal: () => void;
}

export default function ModalHeader({ label, closeModal }: ModalHeaderProps) {
    return (
        <div className='flex flex-row w-full items-center justify-between px-6 pt-5 pb-3'>
            <div className='flex items-center font-semibold text-[17px]'>{label}</div>
            <button
                className='absolute top-4 right-4 flex items-center justify-center w-8 h-8 p-1 rounded-md text-gray-500 hover:bg-zinc-50 duration-150'
                onClick={closeModal}>
                <CloseIcon width="25" />
            </button>
        </div>
    )
}