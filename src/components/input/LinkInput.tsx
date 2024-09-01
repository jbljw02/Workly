type LinkInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
    autoFocus?: boolean;
};

export default function LinkInput({ value, onChange, onKeyDown, placeholder, autoFocus }: LinkInputProps) {
    return (
        <input
            type="text"
            className="bg-transparent border-none outline-none box-border text-sm text-ellipsis w-full"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus} />
    )
}