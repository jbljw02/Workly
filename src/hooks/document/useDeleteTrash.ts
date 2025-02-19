import { deleteAllDocumentsTrashOfFolder, deleteDocumentsFromTrash, deleteFoldersFromTrash, removeDocumentFromFolderTrash } from "@/redux/features/trash/trashSlice";
import { useAppDispatch } from "@/redux/hooks";
import { DocumentProps } from "@/types/document.type";
import { Folder } from "@/types/folder.type";

const useDeleteTrash = () => {
    const dispatch = useAppDispatch();

    // 휴지통에서 문서를 삭제하고 폴더에서 참조 제거
    const deleteTrashDocument = (document: DocumentProps) => {
        dispatch(deleteDocumentsFromTrash(document.id));
        dispatch(removeDocumentFromFolderTrash({
            folderId: document.folderId,
            docId: document.id,
        }));
    }

    // 휴지통에서 폴더를 삭제하고 참조 중인 모든 문서 제거
    const deleteTrashFolder = (folder: Folder) => {
        dispatch(deleteFoldersFromTrash(folder.id));
        dispatch(deleteAllDocumentsTrashOfFolder(folder.id));
    }

    return { deleteTrashDocument, deleteTrashFolder };
}

export default useDeleteTrash;