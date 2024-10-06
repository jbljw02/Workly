import CloseIcon from '../../../public/svgs/close.svg';
import { ReactNode } from 'react';

type ModalHeaderProps = {
    label: ReactNode;
    closeModal: () => void;
}

export default function ModalHeader({ label, closeModal }: ModalHeaderProps) {
    return (
        <div className='flex flex-row justify-between text-[17px] px-6 pt-5 pb-3'>
            <div>{label}</div>
            <button
                onClick={closeModal}
                className="">
                <CloseIcon
                    className="hover:text-gray-500 text-gray-600"
                    width="25" />
            </button>
        </div>
    )
}