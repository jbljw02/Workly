'use client'

import React, { useEffect, useState } from 'react'
import BoldIcon from '../../../../public/svgs/editor-header/bold.svg'
import ItalicIcon from '../../../../public/svgs/editor-header/italic.svg'
import UnderlineIcon from '../../../../public/svgs/editor-header/underline.svg'
import HighlightIcon from '../../../../public/svgs/editor-header/highlight.svg'
import UlIcon from '../../../../public/svgs/editor-header/ul.svg'
import OlIcon from '../../../../public/svgs/editor-header/ol.svg'
import AlignLeftIcon from '../../../../public/svgs/editor-header/align-left.svg'
import FontColorIcon from '../../../../public/svgs/editor-header/font-color.svg'
import ImageIcon from '../../../../public/svgs/editor-header/image.svg'
import LinkIcon from '../../../../public/svgs/editor-header/link.svg'
import CodeIcon from '../../../../public/svgs/editor-header/code.svg'
import ToolbarButton from './ToolbarButton'
import AlignDropdown from './AlignDropdown'
import { Editor } from '@tiptap/react'
import HeadingDropdown from './HeadingDropdown'
import FontSizeCal from './FontSizeCal'
import FontDropdwon from './FontDropdown'
import LineIcon from '../../../../public/svgs/editor-header/line.svg'
import BarDivider from './BarDivider'

export default function MenuBar({ editor }: { editor: Editor }) {
    const [fontSize, setFontSize] = useState<number>(16);
    const [headingLevel, setHeadingLevel] = useState<string>('16');
    const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [isHighlight, setIsHighlight] = useState<boolean>(false);
    const [selectedFont, setSelectedFont] = useState<string>('Arial');

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
    }, [editor, selectedFont, setSelectedFont]);

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }

    return (
        <div className="flex items-center gap-1.5 px-2 py-1 border-b">
            {/* 헤딩을 조절하는 드롭다운 */}
            <HeadingDropdown
                editor={editor && editor}
                headingLevel={headingLevel} />
            <BarDivider />
            {/* 폰트를 변경하는 드롭다운 */}
            <FontDropdwon editor={editor && editor} />
            <BarDivider />
            {/* 폰트 사이즈를 조절하는 영역 */}
            <FontSizeCal
                editor={editor}
                fontSize={fontSize}
                setFontSize={setFontSize} />
            <BarDivider />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={isBold}
                Icon={BoldIcon}
                iconWidth={16} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={isItalic}
                Icon={ItalicIcon}
                iconWidth={14} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={isUnderline}
                Icon={UnderlineIcon}
                iconWidth={14} />
            <ToolbarButton
                onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                isActive={editor && editor.isActive('textStyle', { color: '#958DF1' })}
                Icon={FontColorIcon}
                iconWidth={17} />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={isHighlight}
                Icon={HighlightIcon}
                iconWidth={11} />
            <BarDivider />
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
            {/* 텍스트의 정렬 기준을 정하는 드롭다운 영역 */}
            <div className="relative">
                <ToolbarButton
                    onClick={() => setAlignDropdownOpen(!alignDropdownOpen)}
                    Icon={AlignLeftIcon}
                    iconWidth={21} />
                {
                    alignDropdownOpen && (
                        <AlignDropdown
                            editor={editor}
                            setAlignDropdownOpen={setAlignDropdownOpen} />
                    )
                }
            </div>
            <BarDivider />
            <ToolbarButton
                onClick={addLink}
                Icon={LinkIcon}
                iconWidth={20} />
            <ToolbarButton
                Icon={ImageIcon}
                iconWidth={20} />
            <ToolbarButton
                Icon={CodeIcon}
                iconWidth={20} />
        </div>
    )
}