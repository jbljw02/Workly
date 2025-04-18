import { LinkTooltip, setLinkTooltip } from "@/redux/features/editor/linkSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Editor } from "@tiptap/react";
import React, { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import SaveIcon from '../../../../../public/svgs/editor/save.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import deleteLink from "@/utils/editor/deleteLink";
import { AppDispatch } from "@/redux/store";
import LinkInput from "@/components/input/LinkInput";
import LabelButton from "@/components/button/LabelButton";
import { LinkSectionProps } from "./types/linkSectionProps.type";

export default function LinkEditSection({ editor, isEditing, setIsEditing }: LinkSectionProps) {
    const dispatch = useAppDispatch();

    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const documents = useAppSelector(state => state.documents);

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

        // URL에서 마지막 두 개의 UUID 패턴을 찾음
        const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
        const matches = href.match(uuidPattern);
        let documentName = '';

        if (matches && matches.length >= 2) {
            const documentId = matches[1]; // 두 번째 UUID가 문서 ID
            documentName = documents.find(doc => doc.id === documentId)?.title || '';
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
                tr.addMark(
                    linkStart,
                    linkStart + newText.length,
                    state.schema.marks.link.create({
                        href,
                        id: linkTooltip.id,
                        'document-name': documentName
                    })
                );

                editorDispatch(tr);
                setIsEditing(false);

                dispatch(setLinkTooltip({
                    ...linkTooltip,
                    href: href,
                    text: newText,
                    documentName,
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
            <div className="flex flex-row items-center w-full justify-end mt-4">
                <LabelButton
                    onClick={() => editLink(editor, linkTooltip)}
                    Icon={SaveIcon}
                    iconWidth={15}
                    hover="hover:bg-gray-100"
                    label="저장" />
                <LabelButton
                    onClick={() => deleteLinkInfo(editor, linkTooltip, dispatch)}
                    Icon={DeleteIcon}
                    iconWidth={14}
                    hover="hover:bg-gray-100"
                    label="삭제" />
            </div>
        </div>
    )
}