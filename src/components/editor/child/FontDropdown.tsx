import { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import TriangleDownIcon from '../../../../public/svgs/editor/triangle-down.svg';
import TriangleRightIcon from '../../../../public/svgs/editor/triangle-right.svg';
import TriangleUpIcon from '../../../../public/svgs/editor/triangle-up.svg'
import { Roboto, Noto_Sans_KR, Open_Sans, Nanum_Gothic } from "@next/font/google";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import HoverTooltip from "./HoverTooltip";

type Font = {
    name: string;
    style: string;
};

const roboto = Roboto({
    weight: ['100', '400', '500', '700', '900'],
    subsets: ['latin'],
});

const notoSansKR = Noto_Sans_KR({
    weight: ['100', '400', '500', '700', '900'],
    subsets: ['latin'],
});

const openSans = Open_Sans({
    weight: ['300', '400', '600', '700'],
    subsets: ['latin'],
});

const nanumGothic = Nanum_Gothic({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
});

const fonts: Font[] = [
    { name: 'Arial', style: 'Arial, sans-serif' },
    { name: 'Georgia', style: 'Georgia, serif' },
    { name: 'Roboto', style: roboto.style.fontFamily },
    { name: 'Noto Sans KR', style: notoSansKR.style.fontFamily },
    { name: 'Open Sans', style: openSans.style.fontFamily },
    { name: 'Nanum Gothic', style: nanumGothic.style.fontFamily },
    { name: 'Impact', style: 'Impact, Charcoal, sans-serif' },
    { name: '궁서체', style: 'Gungsuh, serif' },
];

export default function FontDropdown({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFont, setSelectedFont] = useState<string>('Arial');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeFont = (font: Font) => {
        (editor.chain() as any).focus().setFontFamily(font.style).run();
        setSelectedFont(font.name);
        setIsOpen(false);
    };

    // 메뉴바에 표시될 메뉴를 관리
    useEffect(() => {
        if (!editor) return;

        const updateFont = () => {
            const textStyleAttributes = editor.getAttributes('textStyle') || {};
            const currentFontFamily = textStyleAttributes.fontFamily || '';

            if (currentFontFamily) {
                const matchedFont = fonts.find(font => font.style === currentFontFamily);
                if (matchedFont) {
                    setSelectedFont(matchedFont.name);
                } else {
                    setSelectedFont('Arial');
                }
            } else {
                setSelectedFont('Arial');
            }
        };

        editor.on('selectionUpdate', updateFont);
        editor.on('transaction', updateFont);

        return () => {
            editor.off('selectionUpdate', updateFont);
            editor.off('transaction', updateFont);
        };
    }, [editor]);

    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div className="relative" ref={dropdownRef}>
            <HoverTooltip label='글꼴'>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseDown={(e) => e.preventDefault()} // 드래그 상태를 유지
                    className="flex flex-row items-center hover:bg-gray-100 rounded p-2 cursor-pointer">
                    <div className="rounded-md text-sm pr-2">
                        {selectedFont}
                    </div>
                    {
                        isOpen ?
                            <TriangleUpIcon width="14" /> :
                            <TriangleDownIcon width="14" />
                    }
                </div>
            </HoverTooltip>
            {
                isOpen && (
                    <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-sm mt-1 shadow-lg z-10 w-40 text-sm cursor-pointer">
                        {
                            fonts.map((font, index) => (
                                <div
                                    key={index}
                                    onClick={() => changeFont(font)}
                                    className={`flex flex-row justify-between p-2 hover:bg-gray-100 pt-2.5 pb-2.5
                                        ${font.name === selectedFont ? 'bg-gray-100' : ''}`}
                                    style={{ fontFamily: font.style, whiteSpace: 'nowrap' }}>
                                    <div className="pl-1">{font.name}</div>
                                    <TriangleRightIcon width="17" />
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
