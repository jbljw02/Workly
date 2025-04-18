'use client'

import React, { useEffect, useState } from 'react'
import BoldIcon from '../../../../../public/svgs/editor/bold.svg'
import ItalicIcon from '../../../../../public/svgs/editor/italic.svg'
import UnderlineIcon from '../../../../../public/svgs/editor/underline.svg'
import HighlightIcon from '../../../../../public/svgs/editor/highlight.svg'
import UlIcon from '../../../../../public/svgs/editor/ul.svg'
import OlIcon from '../../../../../public/svgs/editor/ol.svg'
import ImageIcon from '../../../../../public/svgs/editor/image.svg'
import CodeIcon from '../../../../../public/svgs/editor/code.svg'
import ToolbarButton from '../../../button/ToolbarButton'
import { Editor } from '@tiptap/react'
import FontSizeCal from '../font/FontSizeCal'
import FontDropdwon from '../font/FontDropdown'
import HoverTooltip from '../../../tooltip/HoverTooltip'
import LineIcon from '../../../../../public/svgs/editor/horizontal-rule.svg'
import FileSearchIcon from '../../../../../public/svgs/editor/file-search.svg'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import ColorPicker from '../color/ColorPicker'
import { setTextColor } from '@/redux/features/editor/textColorSlice'
import VerticalDivider from '../divider/VerticalDivider'
import StrikeIcon from '../../../../../public/svgs/editor/strike.svg'
import BlockquoteIcon from '../../../../../public/svgs/editor/blockquote.svg'
import ManageLink from '../link/ManageLink'
import ManageAlign from '../align/ManageAlign'
import HeadingDropdown from '../heading/HeadingDropdown'
import useUploadImage from '@/hooks/editor/useUploadImage'
import useUploadFile from '@/hooks/editor/useUploadFile'

export default function MenuBar({ editor }: { editor: Editor }) {
    const dispatch = useAppDispatch();

    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const uploadNewImage = useUploadImage(selectedDocument.id);
    const uploadNewFile = useUploadFile(selectedDocument.id);

    const editorPermission = useAppSelector(state => state.editorPermission);

    const [fontSize, setFontSize] = useState<number>(16);
    const [headingLevel, setHeadingLevel] = useState<string>('16');
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [isStrike, setIsStrike] = useState<boolean>(false);
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

            // 현재 선택된 영역의 폰트 색상을 찾아서 설정
            const color = editor.getAttributes('textStyle').color || '#444444';
            dispatch(setTextColor(color));

            // 현재 폰트가 볼드 되어있거나 헤딩이 적용되어 있다면 true
            setIsBold(editor.isActive('bold') || !!currentHeading);
            // 나머지 상태 업데이트
            setIsItalic(editor.isActive('italic'));
            setIsUnderline(editor.isActive('underline'));
            setIsHighlight(editor.isActive('highlight'));
            setIsStrike(editor.isActive('strike'));
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

    // 선택된 파일을 에디터에 이미지로 삽입
    const addFile = (event: Event, mimeType: string) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            const cursorPos = editor.state.selection.from;

            Array.from(files).forEach(file => {
                const fileReader = new FileReader();

                fileReader.onload = () => {
                    const src = fileReader.result as string;

                    // 이미지 파일일 경우
                    if (file.type.startsWith('image/')) {
                        uploadNewImage(editor, file, src);
                    }
                    else {
                        // 이미지가 아닌 일반 파일일 경우
                        uploadNewFile(editor, file, cursorPos);
                    }
                };

                fileReader.readAsDataURL(file);
            });
        }
    };

    // 파일 탐색기를 열기
    const openFileExplorer = (mimeType: string) => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file'; // 파일 탐색기를 열어 파일을 선택할 수 있도록
        if (mimeType === 'image') {
            inputElement.accept = 'image/*'; // 이미지 파일만 선택할 수 있도록 제한
        }
        inputElement.onchange = (event) => addFile(event, mimeType); // 파일을 선택한 후 함수 호출
        inputElement.click();
    };

    return (
        // 사용자에게 문서 편집 권한이 있을 시에만 메뉴바 표시
        editorPermission && editorPermission !== '읽기 허용' && (
            <div className="flex items-center px-2 py-1 border-b z-20 w-full">
                {/* 헤딩을 조절하는 드롭다운 */}
                <HeadingDropdown
                    editor={editor && editor}
                    headingLevel={headingLevel} />
                <VerticalDivider />
                {/* 폰트를 변경하는 드롭다운 */}
                <FontDropdwon editor={editor && editor} />
                <VerticalDivider />
                {/* 폰트 사이즈를 조절하는 영역 */}
                <FontSizeCal
                    editor={editor}
                    fontSize={fontSize}
                    setFontSize={setFontSize} />
                <VerticalDivider />
                <div className="flex flex-row items-center gap-1">
                    {/* 글씨 굵기 */}
                    <HoverTooltip label='굵게'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={isBold}
                            Icon={BoldIcon}
                            iconWidth={16} />
                    </HoverTooltip>
                    {/* 글씨 기울임 */}
                    <HoverTooltip label='기울임'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={isItalic}
                            Icon={ItalicIcon}
                            iconWidth={14} />
                    </HoverTooltip>
                    {/* 글씨 밑줄 */}
                    <HoverTooltip label='밑줄'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={isUnderline}
                            Icon={UnderlineIcon}
                            iconWidth={14} />
                    </HoverTooltip>
                    {/* 글씨 취소선 */}
                    <HoverTooltip label='취소선'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={isStrike}
                            Icon={StrikeIcon}
                            iconWidth={16} />
                    </HoverTooltip>
                    {/* 글씨의 색상을 변경할 수 있는 버튼과 컬러 선택자 */}
                    <ColorPicker editor={editor} />
                    {/* 글씨 형광펜 */}
                    <HoverTooltip label='강조'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            isActive={isHighlight}
                            Icon={HighlightIcon}
                            iconWidth={15} />
                    </HoverTooltip>
                </div>
                <VerticalDivider />
                <div className="flex flex-row items-center gap-1">
                    {/* 순서 없는 리스트 */}
                    <HoverTooltip label='순서 없는 리스트'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor && editor.isActive('bulletList')}
                            Icon={UlIcon}
                            iconWidth={22} />
                    </HoverTooltip>
                    {/* 순서 있는 리스트 */}
                    <HoverTooltip label='순서 있는 리스트'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor && editor.isActive('orderedList')}
                            Icon={OlIcon}
                            iconWidth={22} />
                    </HoverTooltip>
                    {/* 텍스트의 정렬 기준을 정하는 드롭다운 영역 */}
                    <ManageAlign editor={editor} />
                    {/* 수평 구분선 */}
                    <HoverTooltip label='구분선'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            Icon={LineIcon}
                            iconWidth={18} />
                    </HoverTooltip>
                </div>
                <VerticalDivider />
                <div className="flex flex-row items-center gap-1">
                    {/* 이미지 삽입 */}
                    <HoverTooltip label='이미지 삽입'>
                        <ToolbarButton
                            onClick={() => openFileExplorer('image')}
                            Icon={ImageIcon}
                            iconWidth={20} />
                    </HoverTooltip>
                    {/* 파일 삽입 */}
                    <HoverTooltip label='파일 삽입'>
                        <ToolbarButton
                            onClick={() => openFileExplorer('file')}
                            Icon={FileSearchIcon}
                            iconWidth={20} />
                    </HoverTooltip>
                    {/* 링크를 추가하는 영역 */}
                    <ManageLink editor={editor} />
                    {/* 코드 삽입 */}
                    <HoverTooltip label='코드 삽입'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().insertContent('<pre><code></code></pre>').run()}
                            Icon={CodeIcon}
                            iconWidth={20} />
                    </HoverTooltip>
                    <HoverTooltip label='인용구 추가'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            Icon={BlockquoteIcon}
                            iconWidth={20} />
                    </HoverTooltip>
                </div>
            </div>
        )
    )
}