'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer, JSONContent, Extension } from '@tiptap/react'
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import 'tiptap-extension-resizable-image/styles.css';
import '@/styles/editor.css';
import EditorHeader from './child/header/EditorHeader'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import { DocumentProps, renameDocuments, setSelectedDocument, updateDocuments } from '@/redux/features/documentSlice'
import formatTimeDiff from '@/utils/formatTimeDiff'
import MenuBar from './child/menu-bar/MenuBar'
import useEditorExtension from '../hooks/useEditorExtension';
import useVisitDocument from '../hooks/useVisitDocument';
import useDocumentRealTime from '../hooks/useDocumentRealTime';
import useUpdateContent from '../hooks/useUpdateContent';
import useLeavePage from '../hooks/useLeavePage';
import EditorTitleInput from './child/EditorTitleInput';

export default function Editor({ docId }: { docId: string }) {
  const dispatch = useAppDispatch();

  const extensions = useEditorExtension({ docId });
  const editorPermission = useAppSelector(state => state.editorPermission);
  const editor = useEditor({
    extensions: extensions.filter(ext => ext !== false),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
      },
    },
    editable: editorPermission !== '읽기 허용',
  });

  const { updateContent, debouncedUpdateRequest } = useUpdateContent();

  const openColorPicker = useAppSelector(state => state.openColorPicker);
  const selectedDocument = useAppSelector(state => state.selectedDocument);

  const docTitle = useMemo(() => selectedDocument.title, [selectedDocument.title]); // 문서 제목
  const [lastReadedTime, setLastReadedTime] = useState<string>('현재 편집 중'); // 문서의 마지막 편집 시간에 따른 출력값

  // 에디터의 내용이 변경될 때마다 state와의 일관성을 유지
  const updateDocument = useCallback(async () => {
    if (editor && selectedDocument) {
      const content = editor.getJSON();

      // 문서의 내용을 업데이트
      const updatedDoc: DocumentProps = {
        ...selectedDocument,
        docContent: content,
        readedAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
        }
      };

      dispatch(updateDocuments({ docId: updatedDoc.id, ...updatedDoc }));
      setLastReadedTime(formatTimeDiff(updatedDoc.readedAt));
    }
  }, [dispatch, editor, selectedDocument]);

  useEffect(() => {
    editor?.on('update', updateDocument);

    return () => {
      editor?.off('update', updateDocument);
    };
  }, [updateDocument]);

  // 문서명이 변경되었을 때
  const docTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDocument && editorPermission && editorPermission !== '읽기 허용') {
      const updatedDoc: DocumentProps = {
        ...selectedDocument,
        title: e.target.value,
      };

      dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: e.target.value }));
      setLastReadedTime(formatTimeDiff(updatedDoc.readedAt));

      if (updatedDoc.id) {
        debouncedUpdateRequest(updatedDoc);
      }
    }
  }

  // 페이지를 떠나기 이전 변경사항 저장
  const updateContentBeforeLeave = async () => {
    if (selectedDocument.id && selectedDocument.docContent) {
      await updateContent(selectedDocument);
    }
  };

  useDocumentRealTime({ docId }); // 문서의 실시간 변경을 감지
  useVisitDocument({ docId }); // 페이지에 초기 방문 시에 열람일 업데이트
  useLeavePage(updateContentBeforeLeave); // 페이지를 떠날 때 업데이트

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-grow h-full">
      {/* 에디터의 헤더 */}
      <div className="sticky top-0 bg-white z-10">
        <EditorHeader
          editor={editor}
          docTitle={docTitle} />
        <MenuBar editor={editor} />
      </div>
      <div
        className='p-4 h-full'>
        <EditorTitleInput
          docTitle={docTitle}
          docTitleChange={docTitleChange} />
        <DragHandle
          tippyOptions={{
            placement: 'left',
          }}
          editor={editor}>
          <MenuIcon width="17" />
        </DragHandle>
        <EditorContent
          editor={editor}
          className="origin-top-left h-full"
          style={{
            pointerEvents: openColorPicker ? 'none' : undefined,
          }}>
        </EditorContent>
      </div>
    </div>
  )
}