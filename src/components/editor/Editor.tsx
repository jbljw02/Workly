import { useEditor, EditorContent, ReactNodeViewRenderer, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import CodeBlock from '@tiptap/extension-code-block'
import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import MenuBar from './child/MenuBar'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import { FontSize } from '../../../lib/fontSize'
import { FontFamily } from '../../../lib/fontFamily'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import 'tiptap-extension-resizable-image/styles.css';
import FileHandler from '@tiptap-pro/extension-file-handler'
import FileNode from '../../../lib/fileNode'
import { v4 as uuidv4 } from 'uuid';
import '@/styles/editor.css';
import { LinkTooltip, setLinkTooltip } from '@/redux/features/linkSlice'
import LinkNode from '../../../lib/linkNode';
import EditorHeader from './child/header/EditorHeader'
import ImageNodeView from './child/image/ImageNodeView'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import Placeholder from '@tiptap/extension-placeholder'
import { DocumentProps, renameDocuments, setSelectedDocument, updateDocuments } from '@/redux/features/documentSlice'
import formatTimeDiff from '@/utils/formatTimeDiff'
import { debounce } from "lodash";
import axios from 'axios'
import { headers } from 'next/headers'
import { GetServerSideProps } from 'next'

export default function Editor({ docId }: { docId: string }) {
  const dispatch = useAppDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Document,
      Underline,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'highlight',
        },
      }),
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      FontSize,
      FontFamily,
      CodeBlock,
      LinkNode.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        setLinkTooltip: (payload: LinkTooltip) => dispatch(setLinkTooltip(payload))
      }),
      Dropcursor,
      ImageNodeView.configure({
        defaultWidth: 600,
        defaultHeight: 600,
      }),
      FileNode,
      FileHandler.configure({
        onDrop: (currentEditor, files, pos) => {
          files.forEach(file => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
              const src = fileReader.result as string;
              const blobUrl = URL.createObjectURL(file);

              const fileId = uuidv4(); // 파일의 고유 ID 생성

              // 이미지 파일일 경우
              if (file.type.startsWith('image/')) {
                currentEditor.commands.setResizableImage({
                  src: src,
                  alt: '',
                  title: file.name,
                  className: 'resizable-img',
                  'data-keep-ratio': true,
                });
              }
              else {
                // 이미지가 아닌 일반 파일일 경우
                currentEditor.chain().insertContentAt(pos, {
                  type: 'file',
                  attrs: {
                    id: fileId,
                    href: blobUrl,
                    title: file.name,
                    mimeType: file.type,
                    size: file.size,
                  },
                }).focus().run();
              }
            };

            fileReader.readAsDataURL(file);
          });
        },
      }),
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          // 현재 선택된 paragraph 노드만 placeholder 표시
          const { from, to } = editor.state.selection;
          const isSelected = from === to && editor.state.selection.$from.parent === node;

          return node.type.name === 'paragraph' && isSelected ? "명령어를 사용하려면 '/' 키를 누르세요." : '';
        },
        showOnlyCurrent: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
      },
    },
  })

  const openColorPicker = useAppSelector(state => state.openColorPicker);
  const user = useAppSelector(state => state.user);

  const documents = useAppSelector(state => state.documents);
  // 문서들 중에 현재 편집 중인 문서를 선택
  const selectedDocument = useAppSelector(state => state.selectedDocument);
  const [docTitle, setDocTitle] = useState<string>(selectedDocument.title); // 문서 제목
  // 문서의 마지막 편집 시간에 따른 출력값
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('현재 편집 중');

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

  // editor의 값을 state의 값과 동기화
  useEffect(() => {
    // selectedDocument.id를 의존성 배열에 넣음으로써 초기화 시에만 실행 되도록 함
    if (editor && selectedDocument && selectedDocument.docContent) {
      editor.commands.setContent(selectedDocument.docContent);
    }
  }, [editor, selectedDocument.id]);

  // 에디터의 값을 DB에 저장하기 위해 서버로 요청 전송
  // 디바운싱을 이용하여 과도한 요청 방지
  const editorUpdatedRequest = useCallback(
    debounce((updatedDoc, email) => {
      try {
        axios.put(
          '/api/document',
          {
            email: email,
            docId: updatedDoc.id,
            newDocName: updatedDoc.title,
            newDocContent: updatedDoc.docContent,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
      } catch (error) {
        console.error(error);
      }
    }, 1000), // 1초의 딜레이
    []);

  // 에디터의 내용이 변경될 때마다 적용
  useEffect(() => {
    const updateDocument = () => {
      if (editor && selectedDocument) {
        const updatedDoc = {
          ...selectedDocument,
          title: docTitle,
          docContent: editor.getJSON(),
          updatedAt: new Date().toISOString(),
        };

        dispatch(updateDocuments({ docId: updatedDoc.id, updatedData: updatedDoc }));
        dispatch(setSelectedDocument(updatedDoc));
        setLastUpdatedTime(formatTimeDiff(updatedDoc.updatedAt));
        editorUpdatedRequest(updatedDoc, user.email);
      }
    };

    if (editor) {
      editor.on('update', updateDocument);
    }

    return () => {
      editor?.off('update', updateDocument);
    };
  }, [editor, dispatch, selectedDocument]);

  // docTitle이 변경될 때 문서 제목을 업데이트
  useEffect(() => {
    if (selectedDocument) {
      const updatedDoc = {
        ...selectedDocument,
        title: docTitle,
      };

      // 현재 상태와 업데이트하려는 내용이 동일하지 않을 때만 dispatch 호출
      if (selectedDocument.title !== docTitle) {
        dispatch(setSelectedDocument(updatedDoc));
        dispatch(renameDocuments({ docId: updatedDoc.id, newTitle: updatedDoc.title }));
        editorUpdatedRequest(updatedDoc, user.email);
      }
    }
  }, [docTitle, dispatch]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-grow h-full">
      <EditorHeader
        editor={editor}
        docTitle={docTitle}
        lastUpdatedTime={lastUpdatedTime}
        setLastUpdatedTime={setLastUpdatedTime} />
      <MenuBar editor={editor} />
      <div
        id="editor-content"
        className='p-4 h-full'>
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          className="editor-title text-[40px] pl-5 pb-4 font-bold outline-none w-full"
          onKeyDown={(e) => {
            // Enter 키를 눌렀을 때 editor로 포커스를 이동
            if (e.key === 'Enter') {
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