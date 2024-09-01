import { LinkTooltip, setLinkTooltip } from "@/redux/features/linkSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Editor, Mark } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { SelectionPosition } from "./AddLinkSection";
import { LinkAttributes } from "../../../../../lib/linkNode";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import SaveIcon from '../../../../../public/svgs/editor/save.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import CloseIcon from '../../../../../public/svgs/editor/close.svg'
import deleteLink from "@/components/hooks/deleteLink";
import { AppDispatch } from "@/redux/store";
import IconButton from "@/components/button/IconButton";
import LinkInput from "@/components/input/LinkInput";

export default function LinkEditSection({ editor, isEditing, setIsEditing }: LinkSectionProps) {
    const dispatch = useAppDispatch();

    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const [newLink, setNewLink] = useState(linkTooltip.href);
    const [newText, setNewText] = useState(linkTooltip.text);
    const sectionRef = useRef<HTMLDivElement>(null);

    const editLink = (editor: Editor, linkTooltip: LinkTooltip) => {
        const { state, dispatch: editorDispatch } = editor.view;
        const { tr } = state;

        let href = newLink;
        // 링크 URL에 프로토콜이 없을 경우 추가
        if (!/^https?:\/\//i.test(href)) {
            href = `https://${href}`;
        }

        // 링크를 가진 노드 탐색 및 수정
        state.doc.descendants((node, pos) => {
            // 링크가 적용되어 있는 마크를 모두 찾음
            const linkMark = node.marks.find(mark => mark.type === state.schema.marks.link);

            if (linkMark && linkMark.attrs.id === linkTooltip.id) {
                // 링크의 범위를 지정하기 위해 위치를 반환
                const linkStart = pos;
                const linkEnd = pos + node.nodeSize;

                // 새 텍스트로 기존 텍스트를 대체
                tr.replaceWith(linkStart, linkEnd, state.schema.text(newText));

                // 대체된 텍스트 기준으로 링크 마크를 재설정
                tr.addMark(linkStart, linkStart + newText.length, state.schema.marks.link.create({ href }));

                editorDispatch(tr);

                setIsEditing(false);

                dispatch(setLinkTooltip({
                    ...linkTooltip,
                    href: href,
                    text: newText,
                    visible: false
                }));

                return false; // 더 이상 노드를 탐색하지 않음
            }
            return true; // 계속 탐색
        });
    }

    const deleteLinkInfo = (editor: Editor, linkTooltip: LinkTooltip, dispatch: AppDispatch) => {
        deleteLink(editor, linkTooltip, dispatch);
        setIsEditing(false);
        dispatch(setLinkTooltip({ visible: false }));
    }

    const inputKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터 키를 누르면 작업을 마치고 창을 닫음
        if (e.key === 'Enter') {
            editLink(editor, linkTooltip);
        }
        // ESC를 누르면 창 닫음
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }

    useClickOutside(sectionRef, () => setIsEditing(false));
    return (
        <div
            ref={sectionRef}
            className={`relative flex flex-col items-center mt-2 px-4 py-3.5 border border-neutral-300 bg-white rounded-md shadow-[0px_4px_10px_rgba(0,0,0,0.25)] transition-opacity ease-in-out duration-300
                ${isEditing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* a태그 내부의 텍스트 */}
            <div className="flex flex-col mb-3 text-sm">
                <div className="mb-2">제목</div>
                <div className="flex flex-row items-center bg-neutral-100 p-2 rounded-sm -ml-0.5 min-w-72">
                    <LinkInput
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={inputKeyEvent}
                        placeholder="링크의 제목을 입력해주세요" />
                </div>
            </div>
            {/* URL */}
            <div className="flex flex-col text-sm">
                <div className="text-[13px] mb-2">URL</div>
                <div className="flex flex-row items-center bg-neutral-100 p-2 rounded-sm -ml-0.5 min-w-72">
                    <LinkInput
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        onKeyDown={inputKeyEvent}
                        placeholder="URL 혹은 문서명을 입력해주세요"
                        autoFocus />
                </div>
            </div>
            <div className="flex flex-row items-center w-full justify-end text-[13px] mt-4">
                <IconButton
                    onClick={() => editLink(editor, linkTooltip)}
                    icon={<SaveIcon width="15" />}
                    label="저장" />
                <IconButton
                    onClick={() => deleteLinkInfo(editor, linkTooltip, dispatch)}
                    icon={<DeleteIcon width="14" />}
                    label="삭제" />
            </div>
        </div>
    )
}