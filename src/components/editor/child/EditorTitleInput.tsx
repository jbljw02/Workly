import { useAppSelector } from "@/redux/hooks";

type EditorTitleInputProps = {
    docTitle: string;
    docTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditorTitleInput({ docTitle, docTitleChange }: EditorTitleInputProps) {
    const editorPermission = useAppSelector(state => state.editorPermission);
    const webPublished = useAppSelector(state => state.webPublished);
    return (
        <input
            type="text"
            value={docTitle}
            onChange={docTitleChange}
            placeholder="제목을 입력해주세요"
            className="placeholder:text-[#dcdcdc] text-[40px] pl-5 pb-4 font-bold outline-none w-full"
            readOnly={webPublished || editorPermission === '읽기 허용'} />
    )
}