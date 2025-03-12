'use client';

import { setSelectedDocument } from "@/redux/features/document/documentSlice";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import EditorHeader from "../editor/child/header/EditorHeader";
import EditorTitleInput from "../editor/child/EditorTitleInput";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { setWebPublished } from "@/redux/features/document/webPublishedSlice";
import convertTimestamp from "@/utils/format/convertTimestamp";
import useBasicExtension from "@/hooks/editor/extension/useBasicExtension";

type PublishedDocumentProps = {
    document: any;
    content: JSONContent;
}

export default function PublishedDocument({ document, content }: PublishedDocumentProps) {
    const dispatch = useAppDispatch();

    const extension = useBasicExtension();
    const editor = useEditor({
        extensions: extension,
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
            },
        },
    }, [content]);

    useEffect(() => {
        const convertedData = {
            ...document,
            createdAt: convertTimestamp(document.createdAt),
            readedAt: convertTimestamp(document.readedAt),
            publishedDate: document.publishedDate ? convertTimestamp(document.publishedDate) : undefined,
        }
        dispatch(setSelectedDocument(convertedData));
        dispatch(setWebPublished(true));
    }, [document]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex-grow h-full">
            <div className="sticky top-0 bg-white z-10">
                <EditorHeader
                    editor={editor} />
            </div>
            <div className='p-4 h-full'>
                <EditorTitleInput
                    docTitle={document.title}
                    editor={editor} />
                <EditorContent
                    editor={editor}
                    className="origin-top-left h-full" />
            </div>
        </div>
    )
}