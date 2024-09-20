import { InputProps } from "@/types/commonInput";
import { useEffect, useRef } from "react"

interface FormInputProps extends InputProps {
    name?: string;
    setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
    type,
    name,
    value,
    setValue,
    placeholder,
    isInvalidInfo,
    autoFocus }: FormInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current && autoFocus) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (
        <div className="w-full">
            <div className={`rounded border w-full px-3 py-2.5 transition-all duration-200
                ${isInvalidInfo.isInvalid ? 'border-red-500' : 'border-gray-300 focus-within:border-gray-600'}`}>
                <input
                    type={type}
                    name={name}
                    ref={inputRef}
                    className='border-none text-[15px] outline-none bg-transparent w-full'
                    value={value}
                    onChange={setValue}
                    placeholder={placeholder} />
            </div>
            {
                isInvalidInfo.isInvalid &&
                <div className="text-[13px] mt-2 pl-0.5 text-red-500">{isInvalidInfo.msg}</div>
            }
        </div>
    )
}