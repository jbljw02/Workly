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
import React, { useEffect, useState } from 'react'
import MenuBar from './child/MenuBar'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import { FontSize } from '../../../lib/fontSize'
import { FontFamily } from '../../../lib/fontFamily'
import { decreaseEditorScale, increaseEditorScale, setEditorScale } from '@/redux/features/scaleSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Document from '@tiptap/extension-document'
import '@/styles/editor.css';
import Dropcursor from '@tiptap/extension-dropcursor'
import ImageResize from 'tiptap-extension-resize-image'
import { ResizableImage } from 'tiptap-extension-resizable-image';
import 'tiptap-extension-resizable-image/styles.css';
import ImageClickMenu from './child/ImageClickMenu'

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
      Table,
      TableRow,
      TableHeader,
      TableCell,
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
      // ResizableImage.configure({
      //   defaultWidth: 600,
      //   defaultHeight: 600,
      // }),
      ImageClickMenu.configure({
        defaultWidth: 600,
        defaultHeight: 600,
      })
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

  const handleKeyPress = (event: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
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