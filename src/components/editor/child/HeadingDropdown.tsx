import { Level } from "@tiptap/extension-heading";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import TriangleDownIcon from '../../../../public/svgs/editor-header/triangle-down.svg'
import TriangleRightIcon from '../../../../public/svgs/editor-header/triangle-right.svg'

type Options = {
    value: string;
    label: string;
}

export default function HeadingDropdown({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('16');

    const changeHeading = (option: Options) => {
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
            // const fontSize = `${value}px`;
            (editor.chain() as any).setFontSize('16px').run();
        }
        setSelectedValue(option.value);
        setIsOpen(false);
    }

    const options: Options[] = [
        { value: '16', label: '일반 텍스트' },
        { value: 'h1', label: '제목 1' },
        { value: 'h2', label: '제목 2' },
        { value: 'h3', label: '제목 3' },
    ];

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row items-center hover:bg-gray-100 rounded p-2">
                <div
                    className="rounded-md cursor-pointer text-sm pr-2">
                    {/* 현재 선택된 옵션을 출력 */}
                    {
                        options.find(option => option.value === selectedValue)?.label
                    }
                </div>
                <TriangleDownIcon width="14" />
            </div>
            {
                isOpen && (
                    <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-sm mt-1 shadow-lg z-10 w-32 text-sm cursor-pointer">
                        {
                            options.map(option => (
                                <div
                                    key={option.value}
                                    onClick={() => changeHeading(option)}
                                    className={`flex flex-row justify-between p-2 hover:bg-gray-100 pt-3 pb-3
                                        ${option.value === selectedValue ? 'bg-gray-100' : ''}
                                        ${option.value === 'h1' ? 'text-2xl leading-none' : ''} 
                                        ${option.value === 'h2' ? 'text-xl leading-none' : ''} 
                                        ${option.value === 'h3' ? 'text-lg leading-none' : ''} 
                                        ${option.value === '16' ? 'text-base leading-none' : ''}`}>
                                    <div>{option.label}</div>
                                    <TriangleRightIcon width="17" />
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}