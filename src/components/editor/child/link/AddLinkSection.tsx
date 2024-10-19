import { Editor } from "@tiptap/react";
import WorldIcon from '../../../../../public/svgs/editor/world.svg';
import FolderIcon from '../../../../../public/svgs/folder.svg';
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import { v4 as uuidv4 } from 'uuid';
import { LinkAttributes } from "../../../../../lib/linkNode";
import { useAppSelector } from "@/redux/hooks";

export type SelectionPosition = {
    top: number;
    left: number;
}

export type AddLinkSectionProps = {
    editor: Editor;
    position: SelectionPosition;
    setAddingLink: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
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

export default function AddLinkSection({ editor, position, setAddingLink, isOpen }: AddLinkSectionProps) {
    const [link, setLink] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);

    const folders = useAppSelector(state => state.folders);

    // 컴포넌트가 열리면 input으로 포커스하고 드래그된 텍스트를 표시
    useEffect(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            editor.chain().toggleHighlight({ color: '#F3F3F3' }).run()
        }

        return () => {
            // 컴포넌트가 닫힐 때 하이라이트 제거
            editor.commands.unsetMark('highlight');
        };
    }, []);

    const linkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    }

    const inputKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터 키를 누르면 작업을 마치고 창을 닫음
        if (e.key === 'Enter') {
            const inputElement = e.target as HTMLInputElement;
            let href = inputElement.value.trim();

            // 상대 경로로 인식하지 않도록 프로토콜을 추가
            // 예를 들어, naver.com으로 입력할 시에 Workly/naver.com으로 리다이렉션 되지 않도록
            if (!/^https?:\/\//i.test(href)) {
                href = `https://${href}`;
            }

            const id = uuidv4(); // 각 a태그를 구분할 고유값
            (editor.chain() as any).focus().extendMarkRange('link').setLink({ href, id }).run();
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
            className="absolute flex flex-col bg-white text-sm rounded-md p-3 border border-neutral-300 z-10 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]"
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
                    placeholder="링크 붙여넣기 또는 이동할 문서 검색"
                    autoFocus />
            </div>
            {/* 폴더들을 정렬해주는 영역 */}
            <div className="ml-1 mt-4 w-full text-[13px]">
                <div className="mb-1 w-full font-bold">내 폴더</div>
                <div className="w-full -ml-1">
                    {
                        folders.map(folder => (
                            <FolderItem
                                key={folder.id}
                                label={folder.name}
                                onClick={() => console.log('폴더 클릭')} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}