import { useEffect, useRef } from "react"

type CommonInputProps = {
    type: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    isInvalidInfo: { isInvalid: boolean, msg: string };
    autoFocus?: boolean;
}

export default function CommonInput({
    type,
    value,
    setValue,
    placeholder,
    isInvalidInfo,
    autoFocus }: CommonInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current && autoFocus) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (
        <>
            <div className={`rounded border w-full px-3 py-2.5 transition-all duration-200
                ${isInvalidInfo.isInvalid ? 'border-red-500' : 'border-gray-300 focus-within:border-gray-600'}`}>
                <input
                    type={type}
                    ref={inputRef}
                    className='border-none text-[15px] outline-none bg-transparent w-full'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder} />
            </div>
            {
                isInvalidInfo.isInvalid &&
                <div className="text-[13px] mt-2 pl-0.5 text-red-500">{isInvalidInfo.msg}</div>
            }
        </>
    )
}