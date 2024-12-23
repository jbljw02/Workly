type StyleProps = {
    width: string;
    height: string;
    textSize: string;
    textColor: string;
    bgColor: string;
    hover: string;
    borderColor?: string;
};

type CommonButtonProps = {
    style: StyleProps;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function CommonButton({ style, label, onClick, disabled }: CommonButtonProps) {
    const { width, height, textSize, textColor, bgColor, hover, borderColor } = style;
    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            className={`${width} ${height} ${textSize} ${textColor} ${borderColor}
            whitespace-nowrap rounded-lg border transform transition-all duration-200 select-none
            ${disabled ? 'border-gray-300 bg-gray-300 cursor-not-allowed' : `${hover} ${bgColor}`}`}>
            {label}
        </button>
    )
}