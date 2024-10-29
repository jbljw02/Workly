import { InputProps } from "@/types/commonInputProps";
import { useEffect, useRef } from "react"

type StyleProps = {
    px: string;
    py: string;
    textSize: string;
};

export interface CommonInputProps extends InputProps {
    style: StyleProps;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function CommonInput({
    style,
    type,
    value,
    setValue,
    placeholder,
    isInvalidInfo,
    autoFocus }: CommonInputProps) {
    const { px, py, textSize } = style;

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current && autoFocus) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (
        <>
            <div className={`rounded border w-full transition-all duration-200 ${px} ${py}
                ${isInvalidInfo?.isInvalid ? 'border-red-500' : 'border-gray-300 focus-within:border-gray-600'}`}>
                <input
                    type={type}
                    ref={inputRef}
                    className={`border-none outline-none bg-transparent w-full ${textSize}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder} />
            </div>
            {
                isInvalidInfo?.isInvalid && isInvalidInfo?.msg && (
                    <div className="text-[13px] mt-2 pl-0.5 text-red-500">
                        {isInvalidInfo.msg}
                    </div>
                )
            }
        </>
    )
}