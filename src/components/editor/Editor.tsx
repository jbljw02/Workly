'use client';

import { useEditor, EditorContent } from '@tiptap/react'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import 'tiptap-extension-resizable-image/styles.css';
import '@/styles/editor.css';
import '@/styles/imageNode.css';
import EditorHeader from './child/header/EditorHeader'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import { renameDocuments } from '@/redux/features/document/documentSlice'
import MenuBar from './child/header/MenuBar'
import useEditorExtension from '@/hooks/editor/extension/useEditorExtension';
import useVisitDocument from '@/hooks/document/useVisitDocument';
import useDocumentRealTime from '@/hooks/editor/useDocumentRealTime';
import useUpdateContent from '@/hooks/editor/useUpdateContent';
import useLeavePage from '@/hooks/editor/useLeavePage';
import EditorTitleInput from './child/EditorTitleInput';
import EditorHeaderSkeleton from '../placeholder/skeleton/editor/EditorHeaderSkeleton';
import EditorContentSkeleton from '../placeholder/skeleton/editor/EditorContentSkeleton';
import { DocumentProps } from '@/types/document.type';
import useBrowserTitle from '@/hooks/editor/useBrowserTitle';

export default function Editor({ docId }: { docId: string }) {
  const dispatch = useAppDispatch();

  const extensions = useEditorExtension({ docId });
  const editorPermission = useAppSelector(state => state.editorPermission);

  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none w-full h-full',
      },
    },
    editable: editorPermission !== '읽기 허용',
  }, []);

  const openColorPicker = useAppSelector(state => state.openColorPicker);
  const selectedDocument = useAppSelector(state => state.selectedDocument);
  const docSynced = useAppSelector(state => state.docSynced);

  const [docTitle, setDocTitle] = useState('');

  // 문서명이 변경되었을 때
  const docTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDocument && editorPermission && editorPermission !== '읽기 허용') {
      const updatedDoc: DocumentProps = {
        ...selectedDocument,
        title: e.target.value,
      };

      dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: e.target.value }));
      setDocTitle(e.target.value);

      if (updatedDoc.id) {
        debouncedUpdateRequest(updatedDoc);
      }
    }
  }

  // 페이지를 떠나기 이전 변경사항 저장
  const updateContentBeforeLeave = async () => {
    await updateContent(selectedDocument);
  };

  // 문서 내용 업데이트
  const { updateContent, debouncedUpdateRequest } = useUpdateContent(editor);

  useDocumentRealTime({ docId }); // 문서의 실시간 변경을 감지
  useVisitDocument({ docId }); // 페이지에 초기 방문 시에 열람일 업데이트
  useLeavePage(updateContentBeforeLeave); // 페이지를 떠날 때 업데이트
  useBrowserTitle(docTitle); // 브라우저 타이틀 업데이트

  if (!editor) return null;

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* 에디터의 헤더 */}
      {
        selectedDocument.id && docSynced ?
          <div className="sticky top-0 bg-white z-10 min-w-max">
            <EditorHeader
              editor={editor} />
            <MenuBar editor={editor} />
          </div> :
          <EditorHeaderSkeleton />
      }
      {
        selectedDocument.id && docSynced ?
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
              editor={editor}>
              <MenuIcon
                width="17" />
            </DragHandle>
            <EditorContent
              editor={editor}
              className="origin-top-left w-full"
              style={{
                pointerEvents: openColorPicker ? 'none' : undefined,
              }}>
            </EditorContent>
          </div> :
          <EditorContentSkeleton />
      }
    </div>
  )
}