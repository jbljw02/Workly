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
import useUploadContent from '../hooks/useUploadContent';
import useEditorExtension from '../hooks/useEditorExtension';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/navigation';

export default function Editor({ docId }: { docId: string }) {
  const dispatch = useAppDispatch();

  const extensions = useEditorExtension({ docId });
  const uploadContent = useUploadContent();

  const openColorPicker = useAppSelector(state => state.openColorPicker);
  const documents = useAppSelector(state => state.documents);
  // 문서들 중에 현재 편집 중인 문서를 선택
  const selectedDocument = useAppSelector(state => state.selectedDocument);
  const editorPermission = useAppSelector(state => state.editorPermission);

  const [docTitle, setDocTitle] = useState<string>(selectedDocument.title); // 문서 제목
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('현재 편집 중'); // 문서의 마지막 편집 시간에 따른 출력값

  const latestDocRef = useRef(selectedDocument);

  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
      },
    },
    editable: editorPermission !== '읽기 허용',
  });


  // ref를 사용하여 최신 값을 참조해서 담음
  useEffect(() => {
    latestDocRef.current = selectedDocument;
  }, [selectedDocument]);

  // 선택된 문서를 지정
  useEffect(() => {
    if (documents.length && docId) {
      const selectedDoc = documents.find((doc: DocumentProps) => doc.id === docId);
      if (selectedDoc) {
        setDocTitle(selectedDoc?.title);
        dispatch(setSelectedDocument(selectedDoc));
      }
    }
  }, [documents, docId]);

  // 에디터의 내용이 변경될 때마다 적용
  const updateDocument = useCallback(async () => {
    if (editor && latestDocRef.current) {
      const content = editor.getJSON();

      const updatedDoc: DocumentProps = {
        ...latestDocRef.current,
        title: docTitle,
        docContent: content,
        updatedAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
        },
      };

      dispatch(updateDocuments({ docId: updatedDoc.id, ...updatedDoc }));
      dispatch(setSelectedDocument(updatedDoc));
      setLastUpdatedTime(formatTimeDiff(updatedDoc.updatedAt));

      if (updatedDoc.id && updatedDoc.title && updatedDoc.docContent) {
        uploadContent(updatedDoc);
      }
    }
  }, [dispatch, editor, latestDocRef.current]);

  useEffect(() => {
    if (editor) {
      editor.on('update', updateDocument);
    }

    return () => {
      editor?.off('update', updateDocument);
    };
  }, [dispatch, editor, latestDocRef.current]);

  // 문서명이 변경되었을 때
  const docTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (latestDocRef.current && editorPermission && editorPermission !== '읽기 허용') {
      const updatedDoc = {
        ...latestDocRef.current,
        title: e.target.value,
        updatedAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
        },
      };

      setDocTitle(e.target.value);
      dispatch(setSelectedDocument(updatedDoc));
      dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: updatedDoc.title }));
      setLastUpdatedTime(formatTimeDiff(updatedDoc.updatedAt));

      if (updatedDoc.id && updatedDoc.title && updatedDoc.docContent) {
        uploadContent(updatedDoc);
      }
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-grow h-full">
      {/* 에디터의 헤더 */}
      <div className="sticky top-0 bg-white z-10">
        <EditorHeader
          editor={editor}
          docTitle={docTitle}
          lastUpdatedTime={lastUpdatedTime}
          setLastUpdatedTime={setLastUpdatedTime} />
        <MenuBar editor={editor} />
      </div>
      <div
        id="editor-content"
        className='p-4 h-full'>
        <input
          type="text"
          value={docTitle}
          onChange={(e) => docTitleChange(e)}
          placeholder="제목을 입력해주세요"
          className="editor-title text-[40px] pl-5 pb-4 font-bold outline-none w-full"
          onKeyDown={(e) => {
            // Enter 키를 누르거나 방향키 아래를 눌렀을 때 editor로 포커스를 이동
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
              editor.commands.focus();
            }
          }} />
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

