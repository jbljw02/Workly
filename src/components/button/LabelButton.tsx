import React from 'react';

type LabelButtonProps = {
    onClick: (e: React.MouseEvent) => void;
    Icon: React.ElementType;
    iconWidth: number;
    hover: string;
    label?: string;
};

export default function LabelButton({ onClick, Icon, iconWidth, hover, label }: LabelButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-row items-center justify-center p-1 text-xs rounded-sm cursor-pointer
            ${hover}`}>
            <Icon
                width={iconWidth}
                height={iconWidth} />
            {
                label &&
                <div className="ml-1 text-[13px]">{label}</div>
            }
        </button>
    );
}