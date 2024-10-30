import { addDocuments, DocumentProps, setDocuments } from "@/redux/features/documentSlice";
import { addDocumentToFolder, addFolders, Folder, setFolders } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DocumentIcon from '../../../../public/svgs/shared-document.svg';
import RestoreIcon from '../../../../public/svgs/restore.svg';
import TrashIcon from '../../../../public/svgs/trash.svg';
import HoverTooltip from "@/components/editor/child/menu-bar/HoverTooltip";
import LabelButton from "@/components/button/LabelButton";
import { SearchCategory } from "../Trash";
import TrashFolderIcon from '../../../../public/svgs/trash-folder.svg';
import axios from "axios";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { useRef, useState } from "react";
import DeleteCheckModal from "@/components/modal/DeleteCheckModal";
import { deleteAllDocumentsTrashOfFolder, deleteDocumentsFromTrash, deleteFoldersFromTrash, removeDocumentFromFolderTrash, setDocumentsTrash, setFoldersTrash } from "@/redux/features/trashSlice";

type TrashItemProps = {
    searchCategory: SearchCategory;
    item: DocumentProps | Folder;
}

export default function TrashItem({ searchCategory, item }: TrashItemProps) {
    const dispatch = useAppDispatch();

    const folders = useAppSelector(state => state.folders);
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    const documents = useAppSelector(state => state.documents);

    const [isDeleting, setIsDeleting] = useState(false);

    // 문서를 복원
    const restoreDocument = async () => {
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];
        const prevFolders = [...folders];

        try {
            // 부모 폴더가 삭제된 경우 복원 불가
            if (!foldersTrash.some(folder => folder.id !== (item as DocumentProps).folderId)) {
                dispatch(showWarningAlert('해당 문서가 속한 폴더가 삭제되었습니다.'));
                return;
            }

            // 휴지통에서 문서 삭제
            dispatch(deleteDocumentsFromTrash(item.id));
            dispatch(removeDocumentFromFolderTrash({
                folderId: (item as DocumentProps).folderId,
                docId: item.id,
            }));

            // 문서 복원
            dispatch(addDocumentToFolder({
                folderId: (item as DocumentProps).folderId,
                docId: item.id,
            }));

            await axios.post('/api/trash/document', {
                document: item,
                folderId: (item as DocumentProps).folderId,
            });


            dispatch(showCompleteAlert('해당 문서는 복원되었습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('복원에 실패했습니다.'));

            // 요청 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
            dispatch(setFolders(prevFolders));
        }
    }

    // 폴더를 복원
    const restoreFolder = async () => {
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];
        const prevFolders = [...folders];

        try {
            // 휴지통에서 폴더를 삭제하고, 폴더 내의 모든 문서를 삭제
            dispatch(deleteFoldersFromTrash(item.id));
            dispatch(deleteAllDocumentsTrashOfFolder(item.id));

            // 문서 복원
            dispatch(addFolders(item));

            await axios.post('/api/trash/folder', {
                folderId: (item as Folder).id,
            });

            dispatch(showCompleteAlert('해당 폴더는 복원되었습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('복원에 실패했습니다.'));

            // 요청 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
            dispatch(setFolders(prevFolders));
        }
    }

    // 삭제할 아이템이 문서인지 폴더인지 확인하고 작업을 분기
    const restoreItem = () => {
        if (searchCategory === '문서') {
            restoreDocument();
        }
        else {
            restoreFolder();
        }
    }

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
                    <div className="text-[13px] truncate">{
                        searchCategory === '문서' ?
                            (item as DocumentProps).title || '제목 없는 문서' :
                            (item as Folder).name}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                        {searchCategory === '문서' ? (item as DocumentProps).folderName : ''}
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
                        onClick={() => setIsDeleting(true)}
                        hover="hover:bg-gray-200" />
                </HoverTooltip>
            </div>
            {/* 삭제 여부를 다시 확인하는 모달 */}
            <DeleteCheckModal
                isModalOpen={isDeleting}
                setIsModalOpen={setIsDeleting}
                searchCategory={searchCategory}
                item={item} />
        </div>
    )
}