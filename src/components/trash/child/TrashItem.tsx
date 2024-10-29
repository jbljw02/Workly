import { DocumentProps } from "@/redux/features/documentSlice";
import { Folder } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DocumentIcon from '../../../../public/svgs/shared-document.svg';
import RestoreIcon from '../../../../public/svgs/restore.svg';
import TrashIcon from '../../../../public/svgs/trash.svg';
import HoverTooltip from "@/components/editor/child/menu-bar/HoverTooltip";
import LabelButton from "@/components/button/LabelButton";
import { SearchCategory } from "../Trash";
import TrashFolderIcon from '../../../../public/svgs/trash-folder.svg';
import axios from "axios";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { useRef, useState } from "react";
import DeleteCheckModal from "@/components/modal/DeleteCheckModal";

type TrashItemProps = {
    searchCategory: SearchCategory;
    item: DocumentProps | Folder;
    trashList: DocumentProps[] | Folder[];
}

export default function TrashItem({ searchCategory, item, trashList }: TrashItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div
            className="flex flex-row items-center justify-between w-full py-1.5 px-4 hover:bg-gray-100 select-none cursor-pointer">
            <div className="flex flex-row items-center gap-2.5">
                <div className='flex items-center justify-center p-1 w-9 h-9 rounded-lg border-gray-200 border'>
                    {
                        searchCategory === '문서' ?
                            <DocumentIcon
                                className="text-gray-500"
                                width="25" /> :
                            <TrashFolderIcon
                                className="text-gray-500"
                                width="18" />
                    }
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="text-[13px] truncate">{searchCategory === '문서' ? (item as DocumentProps).title : (item as Folder).name}</div>
                    <div className="text-xs text-neutral-500 truncate">{searchCategory === '문서' ? (item as DocumentProps).folderName : ''}</div>
                </div>
            </div>
            <div className="flex flex-row items-center gap-0.5">
                <HoverTooltip label="복원">
                    <LabelButton
                        Icon={RestoreIcon}
                        iconWidth={14}
                        onClick={() => console.log('복원')}
                        hover="hover:bg-gray-200" />
                </HoverTooltip>
                <HoverTooltip label="영구 삭제">
                    <LabelButton
                        Icon={TrashIcon}
                        iconWidth={15}
                        onClick={() => setIsDeleting(true)}
                        hover="hover:bg-gray-200" />
                </HoverTooltip>
            </div>
            {/* 삭제 여부를 다시 확인하는 모달 */}
            <DeleteCheckModal
                isModalOpen={isDeleting}
                setIsModalOpen={setIsDeleting}
                searchCategory={searchCategory}
                item={item}
                trashList={trashList} />
        </div>
    )
}