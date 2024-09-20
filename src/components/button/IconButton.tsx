import React from 'react';

type IconButtonProps = {
    onClick: () => void;
    icon: React.ReactNode;
    label?: string;
};

export default function IconButton({ onClick, icon, label }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-row items-center justify-center p-1 rounded-sm hover:bg-neutral-100 cursor-pointer">
            {icon}
            {
                label &&
                <div className="ml-1 text-sm">{label}</div>
            }
        </button>
    );
}