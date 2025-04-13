import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DocumentIcon from '../../../../public/svgs/shared-document.svg';
import RestoreIcon from '../../../../public/svgs/restore.svg';
import TrashIcon from '../../../../public/svgs/trash.svg';
import HoverTooltip from "@/components/tooltip/HoverTooltip";
import LabelButton from "@/components/button/LabelButton";
import TrashFolderIcon from '../../../../public/svgs/trash-folder.svg';
import { setIsDeletingModalOpen, setSelectedTrashItem } from "@/redux/features/trash/trashSlice";
import { DocumentProps } from "@/types/document.type";
import { Folder } from "@/types/folder.type";
import useRestoreTrash from "@/hooks/trash/useRestoreTrash";

type TrashItemProps = {
    trashItem: DocumentProps | Folder;
}

export default function TrashItem({ trashItem }: TrashItemProps) {
    const dispatch = useAppDispatch();

    const { restoreDocument, restoreFolder } = useRestoreTrash(trashItem);

    const trashSearchCategory = useAppSelector(state => state.trashSearchCategory);

    // 삭제할 아이템이 문서인지 폴더인지 확인하고 작업을 분기
    const restoreItem = () => {
        if (trashSearchCategory === '문서') {
            restoreDocument();
        }
        else {
            restoreFolder();
        }
    }

    return (
        <div className="flex flex-row items-center justify-between w-full py-1.5 px-4 hover:bg-gray-100 select-none cursor-pointer">
            <div className="flex flex-row items-center gap-2.5">
                <div className='flex items-center justify-center p-1 w-9 h-9 rounded-lg border-gray-200 border'>
                    {
                        trashSearchCategory === '문서' ?
                            <DocumentIcon
                                className="text-gray-500"
                                width="25" /> :
                            <TrashFolderIcon
                                className="text-gray-500"
                                width="18" />
                    }
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="text-[13px] truncate">{
                        trashSearchCategory === '문서' ?
                            (trashItem as DocumentProps).title || '제목 없는 문서' :
                            (trashItem as Folder).name}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                        {trashSearchCategory === '문서' ? (trashItem as DocumentProps).folderName : ''}
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center gap-0.5">
                <HoverTooltip label="복원">
                    <LabelButton
                        Icon={RestoreIcon}
                        iconWidth={14}
                        onClick={restoreItem}
                        hover="hover:bg-gray-200" />
                </HoverTooltip>
                <HoverTooltip label="영구 삭제">
                    <LabelButton
                        Icon={TrashIcon}
                        iconWidth={15}
                        onClick={() => {
                            dispatch(setIsDeletingModalOpen(true));
                            dispatch(setSelectedTrashItem(trashItem));
                        }}
                        hover="hover:bg-gray-200" />
                </HoverTooltip>
            </div>
        </div>
    )
}