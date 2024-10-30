type StyleProps = {
    px: string;
    py: string;
    textSize: string;
    textColor: string;
    bgColor: string;
    hover: string;
};

type CommonButtonProps = {
    style: StyleProps;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function CommonButton({ style, label, onClick, disabled }: CommonButtonProps) {
    const { px, py, textSize, textColor, bgColor, hover } = style;

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            className={`${px} ${py} ${textSize} ${textColor}
            whitespace-nowrap rounded-lg border transform transition-all duration-200 select-none
            ${disabled ? 'border-gray-300 bg-gray-300 cursor-not-allowed' : `${hover} ${bgColor}`}`}>
            {label}
        </button>
    )
}