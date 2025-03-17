import { useAppSelector } from "@/redux/hooks";
import LoadingSpinner from "../placeholder/LoadingSpinner";

type StyleProps = {
    width: string;
    height: string;
    textSize: string;
    textColor: string;
    bgColor: string;
    hover: string;
    borderColor?: string;
};

type SubmitButtonProps = {
    style: StyleProps;
    label: string;
    value: string | boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function SubmitButton({ style, label, value, onClick }: SubmitButtonProps) {
    const { width, height, textSize, textColor, bgColor, hover, borderColor } = style;
    const workingSpinner = useAppSelector(state => state.workingSpinner);
    return (
        <button
            type="submit"
            onClick={value ? onClick : undefined}
            disabled={!value || workingSpinner}
            className={`${width} ${height} ${textSize} ${textColor} ${bgColor} ${borderColor}
            ${value && !workingSpinner ? hover : 'border-gray-300 bg-gray-300 cursor-not-allowed'} 
            rounded-lg border transform transition-all duration-200 whitespace-nowrap`}>
            {!workingSpinner && label}
            {
                workingSpinner &&
                <LoadingSpinner
                    size={20}
                    color="#ffffff" />
            }
        </button>
    )
}