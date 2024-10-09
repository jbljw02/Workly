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
};

export default function CommonButton({ style, label, onClick }: CommonButtonProps) {
    const { px, py, textSize, textColor, bgColor, hover } = style;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${px} ${py} ${textSize} ${textColor} ${bgColor} ${hover} 
            whitespace-nowrap rounded-lg border transform transition-all duration-200 select-none`}>
            {label}
        </button>
    )
}