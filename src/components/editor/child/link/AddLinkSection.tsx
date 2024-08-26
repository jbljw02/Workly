import { Editor } from "@tiptap/react";
import WorldIcon from '../../../../../public/svgs/editor/world.svg';
import FolderIcon from '../../../../../public/svgs/folder.svg';
import { useRef, useState } from "react";
import { useClickOutside } from "@/components/hooks/useClickOutside";

export type selectionPosition = {
    top: number;
    left: number;
}

type AddLinkSection = {
    editor: Editor;
    position: selectionPosition;
    setAddingLink: React.Dispatch<React.SetStateAction<boolean>>;
}

type FolderItem = {
    onClick?: () => void;
    label: string;
}

// 하단 폴더들의 개별 요소
function FolderItem({ onClick, label }: FolderItem) {
    return (
        <div
            className="flex flex-row flex-grow w-full px-2 py-1 rounded-sm hover:bg-neutral-100 cursor-pointer"
            onClick={onClick}>
            <FolderIcon width="14" />
            <div className="flex-grow ml-2">{label}</div>
        </div>
    );
}

export default function AddLinkSection({ editor, position, setAddingLink }: AddLinkSection) {
    const [link, setLink] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);

    const linkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    }

    const inputKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터 키를 누르면 작업을 마치고 창을 닫음
        if (e.key === 'Enter') {
            const inputElement = e.target as HTMLInputElement;
            let href = inputElement.value.trim();

            // 상대 경로로 인식하지 않도록 프로토콜을 추가
            if (!/^https?:\/\//i.test(href)) {
                href = `https://${href}`;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
            setAddingLink(false);
        }
        // ESC를 누르면 창 닫음
        if (e.key === 'Escape') {
            setAddingLink(false);
        }
    }

    useClickOutside(containerRef, () => setAddingLink(false));

    return (
        <div
            ref={containerRef}
            className="absolute flex flex-col bg-white text-sm rounded-md p-3 z-10 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]"
            style={{
                top: position.top + window.scrollY + 8, // 스크롤된 양까지 계산
                left: position.left
            }}>
            {/* 링크 input */}
            <div className="flex flex-row items-center bg-neutral-100 p-2 rounded-sm min-w-72">
                <div className="mr-2">
                    <WorldIcon width="14" />
                </div>
                <input
                    type="text"
                    className="bg-transparent border-none outline-none box-border w-full"
                    value={link}
                    onChange={linkChange}
                    onKeyDown={inputKeyEvent}
                    placeholder="링크 붙여넣기 또는 이동할 문서 검색" />
            </div>
            {/* 폴더들을 정렬해주는 영역 */}
            <div className="ml-1 mt-4 w-full text-[13px]">
                <div className="mb-1 w-full font-bold">내 폴더</div>
                <div className="w-full -ml-1">
                    <FolderItem
                        label="내 폴더" />
                    <FolderItem
                        label="미국 여행" />
                    <FolderItem
                        label="베트남 여행" />
                </div>
            </div>
        </div>
    )
}