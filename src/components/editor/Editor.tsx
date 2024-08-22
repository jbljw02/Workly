'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import React, { CSSProperties, useEffect, useState } from 'react'
import MenuBar from './child/MenuBar'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import { FontSize } from '../../../lib/fontSize'
import { FontFamily } from '../../../lib/fontFamily'
import { decreaseEditorScale, increaseEditorScale, setEditorScale } from '@/redux/features/scaleSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import 'tiptap-extension-resizable-image/styles.css';
import ImageNodeView from './child/image/ImageNodeView'
import FileHandler from '@tiptap-pro/extension-file-handler'
import FileNode from '../../../lib/fileNode'
import { v4 as uuidv4 } from 'uuid';
import '@/styles/editor.css';

export default function Editor() {
  const dispatch = useAppDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Document,
      Underline,
      Highlight,
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      FontSize,
      FontFamily,
      CodeBlock,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
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
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(file => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
              const src = fileReader.result as string;

              if (htmlContent) {
                console.log(htmlContent);
                return false;
              }

              // 이미지 파일일 경우
              if (file.type.startsWith('image/')) {
                currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'image',
                  attrs: {
                    src: src,
                    alt: '',
                    title: '',
                    className: 'resizable-img',
                    'data-keep-ratio': true,
                  },
                }).focus().run();
              }
              else {
                // 이미지가 아닌 일반 파일일 경우
                currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'file',
                  attrs: {
                    href: src,
                    title: file.name,
                  },
                }).focus().run();
              }
            };

            fileReader.readAsDataURL(file);
          });
        },
      }),
    ],
    content: `
    <h3 class="text-center">
      Devs Just Want to Have Fun by Cyndi Lauper
    </h3>
    <p class="text-center">
      I come home in the morning light<br>
      My mother says, <mark>“When you gonna live your life right?”</mark><br>
      Oh mother dear we’re not the fortunate ones<br>
      And devs, they wanna have fun<br>
      Oh devs just want to have fun</p>
    <p class="text-center">
      The phone rings in the middle of the night<br>
      My father yells, "What you gonna do with your life?"<br>
      Oh daddy dear, you know you’re still number one<br>
      But <s>girls</s>devs, they wanna have fun<br>
      Oh devs just want to have
    </p>
    <p class="text-center">
      That’s all they really want<br>
      Some fun<br>
      When the working day is done<br>
      Oh devs, they wanna have fun<br>
      Oh devs just wanna have fun<br>
      (devs, they wanna, wanna have fun, devs wanna have)
    </p>
  `,
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-4 focus:outline-none',
      },
    },
  })

  const editorScale = useAppSelector(state => state.editorScale);

  const keyPress = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === '=') {
        event.preventDefault(); // 기본 확대 동작 방지
        dispatch(increaseEditorScale()); // 확대
      }
      if (event.key === '-') {
        event.preventDefault(); // 기본 축소 동작 방지
        dispatch(decreaseEditorScale()); // 축소
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyPress);
    return () => {
      window.removeEventListener('keydown', keyPress);
    };
  }, []);

  return (
    <div className="rounded-lg w-full">
      {
        editor &&
        <MenuBar editor={editor} />
      }
      <EditorContent editor={editor} className="transform origin-top-left transition-transform duration-100"
        style={{ transform: `scale(${editorScale})` }} />
    </div>
  )
}