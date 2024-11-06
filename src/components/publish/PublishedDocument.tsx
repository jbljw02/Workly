'use client';

import { DocumentProps, setSelectedDocument } from "@/redux/features/documentSlice";
import useEditorExtension from "../hooks/useEditorExtension";
import { EditorContent, useEditor } from "@tiptap/react";
import EditorHeader from "../editor/child/header/EditorHeader";
import MenuBar from "../editor/child/menu-bar/MenuBar";
import EditorTitleInput from "../editor/child/EditorTitleInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { setEditorPermission } from "@/redux/features/shareDocumentSlice";

export default function PublishedDocument({ document }: { document: DocumentProps }) {
    const dispatch = useAppDispatch();

    const extension = useEditorExtension({ docId: document.id });
    const editor = useEditor({
        extensions: extension,
        content: document.docContent,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
            },
        },
    });
    
    useEffect(() => {
        dispatch(setSelectedDocument(document));
    }, [document]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex-grow h-full">
            <div className="sticky top-0 bg-white z-10">
                <EditorHeader
                    editor={editor}
                    docTitle={document.title}
                    isPublished={true} />
            </div>
            <div
                className='p-4 h-full'>
                <EditorTitleInput
                    docTitle={document.title}
                    isPublished={true} />
                <EditorContent
                    editor={editor}
                    className="origin-top-left h-full" />
            </div>
        </div>
    )
}