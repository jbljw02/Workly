import { Editor } from "@tiptap/react";

export type LinkSectionProps = {
    editor: Editor;
    isEditing?: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}