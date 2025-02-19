import { Editor } from "@tiptap/react";
import WorldIcon from '../../../../../public/svgs/editor/world.svg';
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import LinkTargetDocumentList from "./LinkTargetDocumentList";
import { useClickOutside } from "@/hooks/common/useClickOutside";

export type SelectionPosition = {
    top: number;
    left: number;
}

export type AddLinkSectionProps = {
    editor: Editor;
    position: SelectionPosition;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    linkRef: React.RefObject<HTMLDivElement>;
}

export default function AddLinkSection({ editor, position, setIsOpen, isOpen, linkRef }: AddLinkSectionProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [link, setLink] = useState<string>('');

    // 컴포넌트가 열리면 input으로 포커스하고 드래그된 텍스트를 표시
    useEffect(() => {
        if (!editor?.chain) return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && isOpen) {
            editor?.chain()?.setHighlight({ color: '#F3F3F3' })?.run()
            inputRef.current?.focus();
        }
        else if (!isOpen) {
            editor?.chain()?.unsetMark('highlight')?.run()
        }

        return () => {
            editor?.chain()?.unsetMark('highlight')?.run()
        };
    }, [isOpen, editor]);

    // 페이지를 떠날 때 하이라이트 마크를 제거
    useEffect(() => {
        const unsetHighlight = () => {
            editor?.chain()?.unsetMark('highlight')?.run()
        };

        window.addEventListener('beforeunload', unsetHighlight);

        return () => {
            window.removeEventListener('beforeunload', unsetHighlight);
        };
    }, [editor]);

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
            setIsOpen(false);
        }
        // ESC를 누르면 창 닫음
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }

    useClickOutside(linkRef, () => setIsOpen(false));

    return (
        <div
            className={`fixed w-80 flex flex-col bg-white text-sm rounded-md p-3 border border-neutral-300 z-10 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]
                transition-opacity duration-200 ease-in-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
                top: `${position.top + 10}px`,
                left: `${position.left}px`,
            }}>
            {/* 링크 input */}
            <div className="flex flex-row items-center bg-neutral-100 p-2 rounded-sm min-w-72">
                <div className="mr-2">
                    <WorldIcon width="14" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="bg-transparent border-none outline-none box-border w-full"
                    value={link}
                    onChange={linkChange}
                    onKeyDown={inputKeyEvent}
                    placeholder="링크 붙여넣기 또는 이동할 문서 검색"
                    autoFocus />
            </div>
            {/* 폴더들을 정렬해주는 영역 */}
            <LinkTargetDocumentList
                editor={editor}
                setIsOpen={setIsOpen}
                searchedValue={link} />
        </div>
    )
}