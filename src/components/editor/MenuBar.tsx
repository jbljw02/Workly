'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import React, { useState } from 'react'
import BoldIcon from '../../../public/svgs/editor-header/bold.svg'
import ItalicIcon from '../../../public/svgs/editor-header/italic.svg'
import UnderlineIcon from '../../../public/svgs/editor-header/underline.svg'
import HighlightIcon from '../../../public/svgs/editor-header/highlight.svg'
import UlIcon from '../../../public/svgs/editor-header/ul.svg'
import OlIcon from '../../../public/svgs/editor-header/ol.svg'
import AlignLeftIcon from '../../../public/svgs/editor-header/align-left.svg'
import AlignRightIcon from '../../../public/svgs/editor-header/align-right.svg'
import AlignCenterIcon from '../../../public/svgs/editor-header/align-center.svg'
import FontColorIcon from '../../../public/svgs/editor-header/font-color.svg'
import ImageIcon from '../../../public/svgs/editor-header/image.svg'
import LinkIcon from '../../../public/svgs/editor-header/link.svg'

export default function MenuBar({ editor }: { editor: any }) {
    const [fontSize, setFontSize] = useState(16);
    const [alignDropdownOpen, setAlignDropdownOpen] = useState(false)

    if (!editor) {
        return null
    }

    const increaseFontSize = () => {
        const newSize = fontSize + 1
        setFontSize(newSize)
        editor.chain().focus().setFontSize(newSize).run()
    }

    const decreaseFontSize = () => {
        const newSize = fontSize - 1
        setFontSize(newSize)
        editor.chain().focus().setFontSize(newSize).run()
    }

    const fontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10)
        if (isNaN(newSize)) return
        setFontSize(newSize)
        editor.chain().focus().setFontSize(newSize).run()
    }

    const toggleAlignDropdown = () => {
        setAlignDropdownOpen(!alignDropdownOpen)
    }

    const setAlignment = (alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run()
        setAlignDropdownOpen(false)
    }


    const addLink = () => {
        const url = window.prompt('Enter URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="flex gap-2 p-2 bg-gray-100 border-b border-gray-300 items-center">
            <select
                onChange={(event) => {
                    const value = event.target.value
                    if (value.startsWith('h')) {
                        const level = parseInt(value.replace('h', ''))
                        editor.chain().focus().toggleHeading({ level }).run()
                    } else {
                        editor.chain().focus().setFontSize(value).run()
                    }
                }}
                className="p-2 bg-white border border-gray-300"
                defaultValue="16"
            >
                <option value="16">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
            </select>
            <div className="flex items-center gap-1">
                <button onClick={decreaseFontSize} className="p-2 bg-white border border-gray-300">-</button>
                <input
                    type="number"
                    value={fontSize}
                    onChange={fontSizeChange}
                    className="w-12 p-2 text-center bg-white border border-gray-300"
                />
                <button onClick={increaseFontSize} className="p-2 bg-white border border-gray-300">+</button>
            </div>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
            >
                <BoldIcon width="25" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
            >
                <ItalicIcon width="15" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
            >
                <UnderlineIcon width="15" />
            </button>
            <button
                onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                className={`p-2 ${editor.isActive('textStyle', { color: '#958DF1' }) ? 'bg-gray-300' : ''}`}
            >
                <FontColorIcon width="18" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`p-2 ${editor && editor.isActive('highlight') ? 'bg-gray-300' : ''}`}
                disabled={!editor}
            >
                <HighlightIcon width="11" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            >
                <UlIcon width="22" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            >
                <OlIcon width="22" />
            </button>
            <div className="relative">
                <button onClick={toggleAlignDropdown} className="p-2 bg-white border border-gray-300 flex items-center">
                    <AlignLeftIcon width="19" />
                </button>
                {alignDropdownOpen && (
                    <div className="absolute top-10 left-0 bg-white border border-gray-300 shadow-lg z-50 flex flex-col w-24">
                        <button onClick={() => setAlignment('left')} className="p-2 hover:bg-gray-200">
                            <AlignLeftIcon width="19" />
                        </button>
                        <button onClick={() => setAlignment('center')} className="p-2 hover:bg-gray-200">
                            <AlignCenterIcon width="19" />
                        </button>
                        <button onClick={() => setAlignment('right')} className="p-2 hover:bg-gray-200">
                            <AlignRightIcon width="19" />
                        </button>
                    </div>
                )}
            </div>
            <button onClick={addLink} className="p-2">
                <LinkIcon width="22" />
            </button>
            <button className="p-2">
                <ImageIcon width="22" />
            </button>
        </div>
    )
}