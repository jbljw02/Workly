'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import React, { useLayoutEffect, useState } from 'react';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg';
import EditorHeader from '../editor/child/header/EditorHeader';
import MenuBar from '../editor/child/header/MenuBar';
import EditorTitleInput from '../editor/child/EditorTitleInput';
import useCommonExtension from '@/hooks/editor/useCommonExtension';
import { renameDocuments, setSelectedDocument } from '@/redux/features/document/documentSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DocumentProps } from '@/types/document.type';
import useUpdateContent from '@/hooks/editor/useUpdateContent';
import '@/styles/imageNode.css';
import '@/styles/editor.css';
import 'tiptap-extension-resizable-image/styles.css';
import EditorContentSkeleton from '../placeholder/skeleton/editor/EditorContentSkeleton';
import EditorHeaderSkeleton from '../placeholder/skeleton/editor/EditorHeaderSkeleton';
import { useRouter } from 'next-nprogress-bar';

export default function DemoEditor({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();

    const router = useRouter();

    const [docTitle, setDocTitle] = useState('');
    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const editorPermission = useAppSelector(state => state.editorPermission);

    const extensions = useCommonExtension();
    const editor = useEditor({
        extensions,
        content: documents.find(doc => doc.id === docId)?.docContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none w-full h-full',
            },
        },
    });

    // 문서 제목 변경 핸들러
    const docTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedDocument && editorPermission && editorPermission !== '읽기 허용') {
            const updatedDoc: DocumentProps = {
                ...selectedDocument,
                title: e.target.value,
            };

            dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: e.target.value }));
            setDocTitle(e.target.value);
        }
    };

    // 문서값이 없는 경우 홈으로 리다이렉트
    useLayoutEffect(() => {
        if (documents.length === 0) {
            router.replace('/demo/home');
        }
    }, []);

    useUpdateContent(editor); // 문서 내용 업데이트

    if (!editor) return null;

    return (
        <div className="w-full h-full overflow-y-auto">
            {
                selectedDocument.id ?
                    <div className="sticky top-0 bg-white z-10 min-w-max">
                        <EditorHeader editor={editor} />
                        <MenuBar editor={editor} />
                    </div> :
                    <EditorHeaderSkeleton />
            }
            {
                selectedDocument.id ?
                    <div className='p-4'>
                        <EditorTitleInput
                            docTitle={docTitle || selectedDocument.title}
                            docTitleChange={docTitleChange}
                            editor={editor} />
                        <DragHandle
                            pluginKey="drag-handle"
                            tippyOptions={{
                                placement: 'left',
                            }}
                            editor={editor} >
                            <MenuIcon width="17" />
                        </DragHandle>
                        <EditorContent
                            editor={editor}
                            className="origin-top-left w-full" />
                    </div> :
                    <EditorContentSkeleton />
            }
        </div>
    );
}