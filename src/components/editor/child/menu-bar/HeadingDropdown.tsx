import { Level } from "@tiptap/extension-heading";
import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import TriangleDownIcon from '../../../../../public/svgs/editor/triangle-down.svg'
import TriangleRightIcon from '../../../../../public/svgs/editor/triangle-right.svg'
import TriangleUpIcon from '../../../../../public/svgs/editor/triangle-up.svg'
import { useClickOutside } from "@/components/hooks/useClickOutside";
import HoverTooltip from "./HoverTooltip";

type Option = {
    value: string;
    label: string;
}

export default function HeadingDropdown({ editor, headingLevel }: { editor: Editor, headingLevel: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options: Option[] = [
        { value: '16', label: '일반 텍스트' },
        { value: 'h1', label: '제목 1' },
        { value: 'h2', label: '제목 2' },
        { value: 'h3', label: '제목 3' },
    ];

    // 현재 선택된 옵션의 label을 찾기
    const selectedLabel = options.find(option => option.value === headingLevel)?.label || '선택되지 않음';

    const changeHeading = (option: Option) => {
        // h 태그일시에
        if (option.value.startsWith('h')) {
            const level = parseInt(option.value.replace('h', ''));
            editor.chain().focus().toggleHeading({ level: level as Level }).run();
        }
        // 일반 텍스트일 때
        else {
            // 헤딩을 p 태그로 변경
            editor.chain().focus().setParagraph().run();
            // textStyle 마크를 제거하여 스타일 초기화
            editor.chain().focus().unsetMark('textStyle').run();
            // 기본 폰트 크기 적용
            (editor.chain() as any).setFontSize('16px').run();
        }
        setIsOpen(false);
    }

    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div
            className="relative w-28 z-30"
            ref={dropdownRef}>
            <HoverTooltip label='스타일'>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseDown={(e) => e.preventDefault()} // 드래그 상태 유지
                    className="flex flex-row items-center justify-between hover:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">
                    {/* 현재 선택된 옵션을 출력 */}
                    <div className="rounded-md text-sm pr-2">
                        {selectedLabel}
                    </div>
                    {
                        isOpen ?
                            <TriangleUpIcon width="14" /> :
                            <TriangleDownIcon width="14" />
                    }
                </div>
            </HoverTooltip>
            {
                <div className={`absolute -left-1 right-0 bg-white border border-gray-200 rounded-sm mt-1 shadow-lg z-30 w-36 text-sm cursor-pointer
                    transition-opacity duration-150 ease-in-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {
                        options.map(option => (
                            <div
                                key={option.value}
                                onClick={() => changeHeading(option)}
                                className={`flex flex-row justify-between px-2 py-3 hover:bg-gray-100 
                                        ${option.value === headingLevel ? 'bg-gray-100' : ''}
                                        ${option.value === 'h1' ? 'text-2xl leading-none' : ''} 
                                        ${option.value === 'h2' ? 'text-xl leading-none' : ''} 
                                        ${option.value === 'h3' ? 'text-lg leading-none' : ''} 
                                        ${option.value === '16' ? 'text-sm leading-none' : ''}`}>
                                <div className="pl-1">{option.label}</div>
                                <TriangleRightIcon width="17" />
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}