'use client'

import React, { useEffect, useState } from 'react'
import BoldIcon from '../../../../public/svgs/editor/bold.svg'
import ItalicIcon from '../../../../public/svgs/editor/italic.svg'
import UnderlineIcon from '../../../../public/svgs/editor/underline.svg'
import HighlightIcon from '../../../../public/svgs/editor/highlight.svg'
import UlIcon from '../../../../public/svgs/editor/ul.svg'
import OlIcon from '../../../../public/svgs/editor/ol.svg'
import AlignLeftIcon from '../../../../public/svgs/editor/align-left.svg'
import FontColorIcon from '../../../../public/svgs/editor/font-color.svg'
import ImageIcon from '../../../../public/svgs/editor/image.svg'
import LinkIcon from '../../../../public/svgs/editor/link.svg'
import CodeIcon from '../../../../public/svgs/editor/code.svg'
import ToolbarButton from './ToolbarButton'
import AlignDropdown from './AlignDropdown'
import { Editor, useCurrentEditor } from '@tiptap/react'
import HeadingDropdown from './HeadingDropdown'
import FontSizeCal from './FontSizeCal'
import FontDropdwon from './FontDropdown'
import BarDivider from './BarDivider'
import RatioDropdown from './RatioDropdown'
import HoverTooltip from './HoverTooltip'
import LineIcon from '../../../../public/svgs/editor/horizontal-rule.svg'
import ImageCropper from './ImageCropper'

export default function MenuBar({ editor }: { editor: Editor }) {
    const [fontSize, setFontSize] = useState<number>(16);
    const [headingLevel, setHeadingLevel] = useState<string>('16');
    const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);
    const [isBold, setIsBold] = useState<boolean>(false);
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [isHighlight, setIsHighlight] = useState<boolean>(false);
    const [selectedFont, setSelectedFont] = useState<string>('Arial');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

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
            editor.chain().focus().extendMarkRange('link').setLink({ href: url })
                .run()
        }
    }

    // 선택된 파일을 에디터에 이미지로 삽입
    const addImageFromFile = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader(); // 파일을 읽기 위힌 FileReader 객체 생성
            reader.onload = (readerEvent) => {
                const src = readerEvent.target?.result as string; // setImage 메소드에 사용하기 위해 string으로 캐스팅
                if (src) {
                    // editor.chain().focus().setImage({ src }).run();
                    // 크기를 조정할 수 있는 이미지를 생성
                    editor.commands.setResizableImage({
                        src: src,
                        alt: '',
                        title: '',
                        className: 'resizable-img',
                        'data-keep-ratio': true,
                    });
                    setSelectedImage(src);
                }
            };
            reader.readAsDataURL(file); // FileReader가 파일을 읽고, 결과를 Base64 형식의 URL로 반환하도록 요청
        }
    };

    // 파일 탐색기를 염
    const addImage = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file'; // 파일 탐색기를 열어 파일을 선택할 수 있도록
        inputElement.accept = 'image/*'; // 이미지 파일만 선택할 수 있도록 제한
        inputElement.onchange = (event) => addImageFromFile(event); // 파일을 선택한 후 함수 호출
        inputElement.click();
    };

    const handleCropComplete = (croppedSrc: string) => {
        console.log("Cropped Image URL:", croppedSrc);
        // 크롭이 완료된 이미지를 에디터에 다시 삽입하는 로직을 여기에 추가
        setShowCropper(false); // 크로퍼를 닫음
    };



    return (
        <div className="flex items-center gap-1.5 px-2 py-1 border-b">
            {
                selectedImage && (
                    <button onClick={() => setShowCropper(true)}>이미지 크롭</button>
                )
            }
            {
                showCropper && selectedImage && (
                    <ImageCropper src={selectedImage} onComplete={handleCropComplete} />
                )
            }
            <HoverTooltip label='화면 비율'>
                {/* 화면의 스케일(확대 비율)을 조절하는 드롭다운 */}
                <RatioDropdown />
            </HoverTooltip>
            {/* 헤딩을 조절하는 드롭다운 */}
            <HoverTooltip label='스타일'>
                <HeadingDropdown
                    editor={editor && editor}
                    headingLevel={headingLevel} />
            </HoverTooltip>
            <BarDivider />
            <HoverTooltip label='글꼴'>
                {/* 폰트를 변경하는 드롭다운 */}
                <FontDropdwon editor={editor && editor} />
            </HoverTooltip>
            <BarDivider />
            <HoverTooltip label='글꼴 크기'>
                {/* 폰트 사이즈를 조절하는 영역 */}
                <FontSizeCal
                    editor={editor}
                    fontSize={fontSize}
                    setFontSize={setFontSize} />
            </HoverTooltip>
            <BarDivider />
            <HoverTooltip label='굵게'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={isBold}
                    Icon={BoldIcon}
                    iconWidth={16} />
            </HoverTooltip>
            <HoverTooltip label='기울임'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={isItalic}
                    Icon={ItalicIcon}
                    iconWidth={14} />
            </HoverTooltip>
            <HoverTooltip label='밑줄'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={isUnderline}
                    Icon={UnderlineIcon}
                    iconWidth={14} />
            </HoverTooltip>
            <HoverTooltip label='글자 색상'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    isActive={editor && editor.isActive('textStyle', { color: '#958DF1' })}
                    Icon={FontColorIcon}
                    iconWidth={17} />
            </HoverTooltip>
            <HoverTooltip label='강조'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    isActive={isHighlight}
                    Icon={HighlightIcon}
                    iconWidth={11} />
            </HoverTooltip>
            <BarDivider />
            <HoverTooltip label='순서 없는 리스트'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor && editor.isActive('bulletList')}
                    Icon={UlIcon}
                    iconWidth={22} />
            </HoverTooltip>
            <HoverTooltip label='순서 있는 리스트'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor && editor.isActive('orderedList')}
                    Icon={OlIcon}
                    iconWidth={22} />
            </HoverTooltip>
            <HoverTooltip label='정렬'>
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
            </HoverTooltip>
            <HoverTooltip label='구분선'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    Icon={LineIcon}
                    iconWidth={18} />
            </HoverTooltip>
            <BarDivider />
            <HoverTooltip label='링크 삽입'>
                <ToolbarButton
                    onClick={addLink}
                    Icon={LinkIcon}
                    iconWidth={20} />
            </HoverTooltip>
            <HoverTooltip label='이미지 삽입'>
                <ToolbarButton
                    onClick={addImage}
                    Icon={ImageIcon}
                    iconWidth={20} />
            </HoverTooltip>
            <HoverTooltip label='코드 삽입'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setCodeBlock().run()}
                    Icon={CodeIcon}
                    iconWidth={20} />
            </HoverTooltip>
        </div>
    )
}