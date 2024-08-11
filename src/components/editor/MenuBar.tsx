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
import React, { useEffect, useState } from 'react'
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
import CodeIcon from '../../../public/svgs/editor-header/code.svg'
import { FontSize } from '../../../lib/fontSize'
import ToolbarButton from './ToolbarButton'

export default function MenuBar({ editor }: { editor: any }) {
    const [fontSize, setFontSize] = useState<number>(16);
    const [headingLevel, setHeadingLevel] = useState<string>('16');
    const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [isHighlight, setIsHighlight] = useState<boolean>(false);

    useEffect(() => {
        // 에디터가 초기화 되지 않았을 시
        if (!editor) return;

        // 에디터 내의 현재 상황에 따라 메뉴바를 업데이트
        const updateMenuBar = () => {
            // textStyle에서 현재 폰트 사이즈를 가져와서 할당
            const textStyleAttributes = editor.getAttributes('textStyle') || {};
            const currentFontSize = textStyleAttributes.fontSize;

            // heading 요소의 레벨을 확인(h1,h2,h3...)
            const currentHeading = editor.getAttributes('heading').level;

            if (currentHeading) {
                setHeadingLevel(`h${currentHeading}`);
            } else {
                setHeadingLevel('16'); // 기본값 설정
            }

            if (currentFontSize) {
                setFontSize(parseInt(currentFontSize.replace('px', ''), 10));
            }
            else if (currentHeading) {
                // heading에 대해 기본 폰트 사이즈 설정
                switch (currentHeading) {
                    case 1:
                        setFontSize(30); // h1 기본 크기
                        break;
                    case 2:
                        setFontSize(24); // h2 기본 크기
                        break;
                    case 3:
                        setFontSize(20); // h3 기본 크기
                        break;
                    default:
                        setFontSize(16); // 기본값
                }
            }
            else {
                setFontSize(16); // 기본값 설정
            }

            // 현재 폰트가 볼드 되어있거나 헤딩이 적용되어 있다면 true
            setIsBold(editor.isActive('bold') || !!currentHeading);
            // 나머지 상태 업데이트
            setIsItalic(editor.isActive('italic'));
            setIsUnderline(editor.isActive('underline'));
            setIsHighlight(editor.isActive('highlight'));
        };

        // selectionUpdate: 에디터 내에서 '텍스트 선택'이 변경될 때마다 트리거
        // transaction: 에디터에서 일어나는 '모든 변경사항'에 대해 트리거
        editor.on('selectionUpdate', updateMenuBar);
        editor.on('transaction', updateMenuBar);

        return () => {
            editor.off('selectionUpdate', updateMenuBar);
            editor.off('transaction', updateMenuBar);
        }
    }, [editor]);

    const changeHeading = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        // h 태그일시에
        if (value.startsWith('h')) {
            const level = parseInt(value.replace('h', ''));
            editor.chain().focus().toggleHeading({ level }).run();
        }
        // 일반 텍스트일 때
        else {
            // 헤딩을 p 태그로 변경
            editor.chain().focus().setParagraph().run();
            // textStyle 마크를 제거하여 스타일 초기화
            editor.chain().focus().unsetMark('textStyle').run();
            // 기본 폰트 크기 적용
            // const fontSize = `${value}px`;
            editor.chain().focus().setFontSize('16px').run();
        }
    }

    // 폰트 크기 조절
    const increaseFontSize = () => {
        const newSize = fontSize + 1;
        setFontSize(newSize);
        editor.chain().focus().setFontSize(`${newSize}px`).run();
    }
    const decreaseFontSize = () => {
        const newSize = fontSize - 1;
        setFontSize(newSize);
        editor.chain().focus().setFontSize(`${newSize}px`).run();
    }
    const fontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newSize = parseInt(value, 10);
        setFontSize(newSize);
        editor.chain().focus().setFontSize(`${newSize}px`).run();
    }

    // 정렬 드롭다운 컨트롤
    const toggleAlignDropdown = () => {
        setAlignDropdownOpen(!alignDropdownOpen);
    }
    const setAlignment = (alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setAlignDropdownOpen(false);
    }

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }

    return (
        <div className="flex gap-2 p-2 items-center border-b">
            <select
                onChange={changeHeading}
                className="p-2 bg-white border border-gray-300"
                value={headingLevel}>
                <option value="16">일반 텍스트</option>
                <option value="h1">제목 1(대)</option>
                <option value="h2">제목 2(중)</option>
                <option value="h3">제목 3(소)</option>
            </select>
            <div className="flex items-center gap-1">
                <button onClick={decreaseFontSize} className="p-2 bg-white border border-gray-300">-</button>
                <input
                    type="number"
                    value={fontSize}
                    onChange={fontSizeChange}
                    className="w-12 p-2 text-center bg-white border border-gray-300" />
                <button onClick={increaseFontSize} className="p-2 bg-white border border-gray-300">+</button>
            </div>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={isBold}
                Icon={BoldIcon}
                iconWidth={25} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={isItalic}
                Icon={ItalicIcon}
                iconWidth={15} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={isUnderline}
                Icon={UnderlineIcon}
                iconWidth={15} />
            <ToolbarButton
                onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                isActive={editor && editor.isActive('textStyle', { color: '#958DF1' })}
                Icon={FontColorIcon}
                iconWidth={18} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={isHighlight}
                Icon={HighlightIcon}
                iconWidth={11} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor && editor.isActive('bulletList')}
                Icon={UlIcon}
                iconWidth={22} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor && editor.isActive('orderedList')}
                Icon={OlIcon}
                iconWidth={22} />
            <div className="relative">
                <ToolbarButton
                    onClick={toggleAlignDropdown}
                    Icon={AlignLeftIcon}
                    iconWidth={19} />
                {
                    alignDropdownOpen && (
                        <div className="absolute top-10 left-0 bg-white border border-gray-300 shadow-lg flex flex-col w-24 z-50">
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
                    )
                }
            </div>
            <ToolbarButton
                onClick={addLink}
                Icon={LinkIcon}
                iconWidth={22} />
            <ToolbarButton
                Icon={ImageIcon}
                iconWidth={22} />
            <ToolbarButton
                Icon={CodeIcon}
                iconWidth={22} />
        </div>
    )
}