'use client';

import { useEditor, EditorContent } from '@tiptap/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import 'tiptap-extension-resizable-image/styles.css';
import '@/styles/editor.css';
import '@/styles/imageNode.css';
import EditorHeader from './child/header/EditorHeader'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import { renameDocuments, setSelectedDocument, updateDocuments } from '@/redux/features/document/documentSlice'
import formatTimeDiff from '@/utils/formatTimeDiff'
import MenuBar from './child/header/MenuBar'
import useEditorExtension from '@/hooks/editor/useEditorExtension';
import useVisitDocument from '@/hooks/document/useVisitDocument';
import useDocumentRealTime from '@/hooks/editor/useDocumentRealTime';
import useUpdateContent from '@/hooks/editor/useUpdateContent';
import useLeavePage from '@/hooks/editor/useLeavePage';
import EditorTitleInput from './child/EditorTitleInput';
import EditorHeaderSkeleton from '../placeholder/skeleton/editor/EditorHeaderSkeleton';
import EditorContentSkeleton from '../placeholder/skeleton/editor/EditorContentSkeleton';
import { usePathname } from 'next/navigation';
import { DocumentProps } from '@/types/document.type';

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

  const { updateContent, debouncedUpdateRequest } = useUpdateContent();

  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
  const documentId = pathParts[3]; // documentId는 3번째 인덱스

  const documents = useAppSelector(state => state.documents);
  const folders = useAppSelector(state => state.folders);
  const openColorPicker = useAppSelector(state => state.openColorPicker);
  const selectedDocument = useAppSelector(state => state.selectedDocument);
  const docSynced = useAppSelector(state => state.docSynced);

  const [docTitle, setDocTitle] = useState('');
  const [lastReadedTime, setLastReadedTime] = useState<string>('현재 편집 중'); // 문서의 마지막 편집 시간에 따른 출력값

  // 문서가 변경될 때 문서명의 초기값 지정
  useEffect(() => {
    setDocTitle(selectedDocument.title);
  }, [selectedDocument.title]);

  // 현재 선택된 문서를 지정
  // documents의 값이 변경될 때마다 현재 선택된 문서의 값도 업데이트
  useEffect(() => {
    const currentDocument = documents.find(doc => doc.id === documentId);
    if (currentDocument) {
      dispatch(setSelectedDocument(currentDocument));
    }
  }, [documents]);

  // 에디터의 내용이 변경될 때마다 state와의 일관성을 유지
  useEffect(() => {
    if (!editor || !selectedDocument) return;

    const updateDocument = async () => {
      const content = editor.getJSON();

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
    };

    editor.on('update', updateDocument);

    return () => {
      editor.off('update', updateDocument);
    };
  }, [editor, selectedDocument, dispatch]);

  // 문서명이 변경되었을 때
  const docTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDocument && editorPermission && editorPermission !== '읽기 허용') {
      const updatedDoc: DocumentProps = {
        ...selectedDocument,
        title: e.target.value,
      };

      dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: e.target.value }));
      setDocTitle(e.target.value);
      setLastReadedTime(formatTimeDiff(updatedDoc.readedAt));

      if (updatedDoc.id) {
        debouncedUpdateRequest(updatedDoc);
      }
    }
  }

  // 페이지를 떠나기 이전 변경사항 저장
  const updateContentBeforeLeave = async () => {
    await updateContent(selectedDocument);
  };

  useDocumentRealTime({ docId }); // 문서의 실시간 변경을 감지
  useVisitDocument({ docId }); // 페이지에 초기 방문 시에 열람일 업데이트
  useLeavePage(updateContentBeforeLeave); // 페이지를 떠날 때 업데이트

  if (!editor) {
    return null;
  }

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
          <div
            className='p-4'>
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