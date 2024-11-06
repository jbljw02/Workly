import { useAppSelector } from "@/redux/hooks";

type EditorTitleInputProps = {
    docTitle: string;
    docTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPublished?: boolean;
}

export default function EditorTitleInput({ docTitle, docTitleChange, isPublished }: EditorTitleInputProps) {
    const editorPermission = useAppSelector(state => state.editorPermission);
    return (
        <input
            type="text"
            value={docTitle}
            onChange={docTitleChange}
            placeholder="제목을 입력해주세요"
            className="placeholder:text-[#dcdcdc] text-[40px] pl-5 pb-4 font-bold outline-none w-full"
            readOnly={isPublished || editorPermission === '읽기 허용'} />
    )
}