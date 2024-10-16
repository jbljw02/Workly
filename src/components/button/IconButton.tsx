import React from 'react';

type IconButtonProps = {
    onClick: () => void;
    icon: React.ReactNode;
    hover: string;
    label?: string;
};

export default function IconButton({ onClick, icon, hover, label }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-row items-center justify-center p-1 rounded-sm cursor-pointer
            ${hover}`}>
            {icon}
            {
                label &&
                <div className="ml-1 text-[13px]">{label}</div>
            }
        </button>
    );
}