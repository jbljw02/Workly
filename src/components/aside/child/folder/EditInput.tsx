import { useEffect, useRef } from "react";

type EditInputProps = {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    completeEdit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditInput({
    title,
    setTitle,
    completeEdit,
    isEditing,
    setIsEditing
}: EditInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    return (
        <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={completeEdit}
            className="text-sm truncate bg-transparent outline-none"
            onBlur={() => setIsEditing(false)}
            autoFocus />
    )
}