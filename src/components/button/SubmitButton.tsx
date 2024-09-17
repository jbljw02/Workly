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
    value: string;
    onClick?: () => void;
};

export default function CommonButton({ style, label, value, onClick }: CommonButtonProps) {
    const { px, py, textSize, textColor, bgColor, hover } = style;

    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={!value}
            // 입력값이 존재할 때만 버튼 활성화
            className={`${px} ${py} ${textSize} ${textColor} ${bgColor}
            ${value ? hover : 'border-gray-300 bg-gray-300 cursor-not-allowed'} 
            rounded-lg border transform transition-all duration-200`}>
            {label}
        </button>
    )
}