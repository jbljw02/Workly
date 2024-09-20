'use client'

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
import React, { CSSProperties, useEffect, useState } from 'react'
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
import EditorHeader from './child/EditorHeader'
import ImageNodeView from './child/image/ImageNodeView'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import Placeholder from '@tiptap/extension-placeholder'
import { DocumentProps, updateDocuments } from '@/redux/features/documentSlice'
import formatTimeDiff from '@/utils/formatTimeDiff'

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

  const documents = useAppSelector(state => state.documents);
  const [docTitle, setDocTitle] = useState<string>(''); // 문서 제목
  // 문서들 중에 현재 편집 중인 문서를 선택
  const [selectedDoc, setSelectedDoc] = useState<DocumentProps>({
    id: '',
    title: '',
    docContent: null,
    createdAt: '',
    updatedAt: '',
    author: {
      email: '',
      name: '',
    },
  });
  // 문서의 마지막 편집 시간에 따른 출력값
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('현재 편집 중');

  useEffect(() => {
    if (documents.length && docId) {
      const selectedDoc = documents.find((doc: DocumentProps) => doc.id === docId);
      setSelectedDoc(selectedDoc);
    }
  }, [documents, docId]);

  useEffect(() => {
    if (editor && selectedDoc) {
      // 에디터 업데이트 발생 시 실행
      editor.on('update', () => {
        const updatedDoc = {
          ...selectedDoc, // 현재 선택된 문서
          title: docTitle,
          docContent: editor.getJSON(), // 에디터 내용 
          updatedAt: new Date().toISOString(), // 업데이트 시간
        };

        dispatch(updateDocuments(updatedDoc));
        setSelectedDoc(updatedDoc);
        setLastUpdatedTime(formatTimeDiff(updatedDoc.updatedAt));
      });
    }

    return () => {
      editor?.off('update');
    };
  }, [editor, docTitle, dispatch]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-grow h-full">
      <EditorHeader
        editor={editor}
        selectedDoc={selectedDoc}
        lastUpdatedTime={lastUpdatedTime}
        setLastUpdatedTime={setLastUpdatedTime} />
      <MenuBar editor={editor} />
      <div className='m-4 h-full'>
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          className="editor-title text-[40px] pl-5 font-bold outline-none w-full"
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
            pointerEvents: openColorPicker && 'none',
          }}>
        </EditorContent>
      </div>
    </div>
  )
}