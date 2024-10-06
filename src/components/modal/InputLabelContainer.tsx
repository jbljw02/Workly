import CommonInput, { CommonInputProps } from "../input/CommonInput";

type InputLabelContainerProps = {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
}

export default function InputLabelContainer({ label, value, setValue, placeholder }: InputLabelContainerProps) {
    return (
        <div className="flex flex-col px-6">
            <div className='text-sm mt-2 mb-2 pl-0.5'>{label}</div>
            <CommonInput
                type="text"
                value={value}
                setValue={setValue}
                placeholder={placeholder}
                autoFocus={true} />
        </div>
    )
}