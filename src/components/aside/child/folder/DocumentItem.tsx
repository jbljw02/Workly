import { Folder } from "@/redux/features/folderSlice"
import DocumentIcon from '../../../../../public/svgs/document.svg';
import { useRef, useState } from "react";
import HoverTooltip from "@/components/editor/child/HoverTooltip";
import GroupHoverItem from "../GroupHoverItem";
import ArrowIcon from '../../../../../public/svgs/right-arrow.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import { DocumentProps } from "@/redux/features/documentSlice";

type DocumentItemProps = {
    document: DocumentProps;
}

export default function DocumentItem({ document }: DocumentItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex flex-row justify-between items-center pl-3 pr-1 w-full h-[30px] text-sm rounded cursor-pointer overflow-hidden hover:bg-gray-100 group">
            {/* 아이콘과 문서명 */}
            <div className="flex flex-row gap-2 text-zinc-600 overflow-hidden">
                <div className="flex flex-shrink-0">
                    <DocumentIcon width="15" />
                </div>
                <div className="truncate">{document.title || '제목 없는 문서'}</div>
            </div>
            {/* 문서에 적용할 수 있는 옵션들 */}
            <div className="flex flex-row items-center ml-1">
                <HoverTooltip label='폴더명 수정'>
                    <GroupHoverItem
                        Icon={EditIcon}
                        IconWidth={15}
                        onClick={() => setIsEditing(true)} />
                </HoverTooltip>
                <HoverTooltip label='폴더 삭제'>
                    <GroupHoverItem
                        Icon={DeleteIcon}
                        IconWidth={15}
                        onClick={() => console.log("A")} />
                </HoverTooltip>
            </div>
        </div>
    )
}