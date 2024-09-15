type StyleProps = {
    px: string;
    py: string;
    textSize: string;
    textColor: string;
    bgColor: string;
};

type CommonButtonProps = {
    style: StyleProps;
    label: string;
    onClick?: () => void;
};

export default function CommonButton({ style, label }: CommonButtonProps) {
    const { px, py, textSize, textColor, bgColor } = style;

    return (
        <button
            className={`${px} ${py} ${textSize} ${textColor} ${bgColor} 
            rounded-lg border transform hover:scale-105 transition-all duration-200`}>
            {label}
        </button>
    )
}