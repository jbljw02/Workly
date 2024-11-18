import WarningAlert from "@/components/alert/WarningAlert";
import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import HoverTooltip from "../../../tooltip/HoverTooltip";
import ToolbarButton from "../../../button/ToolbarButton";
import AddLinkSection, { SelectionPosition } from "./AddLinkSection";
import LinkIcon from '../../../../../public/svgs/editor/link.svg'
import LinkTooltip from "./LinkTooltip";

type ManagementLinkProps = {
    editor: Editor;
}

export default function ManageLink({ editor }: ManagementLinkProps) {
    const linkRef = useRef<HTMLDivElement>(null);

    const [selectionPos, setSelectionPos] = useState<SelectionPosition>({ top: 0, left: 0 });
    const [addingLink, setAddingLink] = useState<boolean>(false);
    const [linkNoticeModal, setLinkNoticeModal] = useState<boolean>(false);

    // 선택된 텍스트의 위치를 찾고 링크를 추가하는 컴포넌트를 열기
    const addLink = () => {
        const selection = window.getSelection();

        // 토글을 위해 링크 추가 창이 열려있으면 닫기
        if (addingLink) {
            setAddingLink(false);
        }

        if (selection && selection.rangeCount > 0 && selection.toString().trim() !== "") {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            setSelectionPos({
                top: rect.bottom + scrollTop, // 선택 영역 하단
                left: rect.left, // 선택 영역 왼쪽 시작점
            });
            setAddingLink(!addingLink);
        }
        else if (selection && !selection.toString().trim() && !addingLink) {
            setAddingLink(false);
            setLinkNoticeModal(true);
        }
    };

    return (
        <div ref={linkRef}>
            <HoverTooltip label='링크 삽입'>
                <ToolbarButton
                    onClick={addLink}
                    Icon={LinkIcon}
                    iconWidth={20} />
            </HoverTooltip>
            <AddLinkSection
                editor={editor}
                position={selectionPos}
                setIsOpen={setAddingLink}
                isOpen={addingLink}
                linkRef={linkRef} />
            {/* 링크 hover 시에 보일 풍선 */}
            <LinkTooltip editor={editor} />
            <WarningAlert
                isModalOpen={linkNoticeModal}
                setIsModalOpen={setLinkNoticeModal}
                label="링크를 연결할 영역을 드래그해주세요" />
        </div>
    )
}