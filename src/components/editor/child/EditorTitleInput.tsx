import { useAppSelector } from "@/redux/hooks";
import { Editor } from "@tiptap/react";

type EditorTitleInputProps = {
    docTitle: string;
    docTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editor: Editor;
}

export default function EditorTitleInput({ docTitle, docTitleChange, editor }: EditorTitleInputProps) {
    const editorPermission = useAppSelector(state => state.editorPermission);
    const webPublished = useAppSelector(state => state.webPublished);
    return (
        <input
            type="text"
            value={docTitle}
            onChange={docTitleChange}
            placeholder="제목을 입력해주세요"
            className="placeholder:text-[#dcdcdc] text-[40px] pl-5 pb-4 font-bold outline-none w-full"
            readOnly={webPublished || editorPermission === '읽기 허용'}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                    editor.commands.focus();
                }
            }} />
    )
}