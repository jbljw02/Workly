import { showWarningAlert, showCompleteAlert } from "@/redux/features/common/alertSlice";
import { addDocuments } from "@/redux/features/document/documentSlice";
import { addDocumentToFolder, addFolders } from "@/redux/features/folder/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Folder } from "@/types/folder.type";
import axios from "axios";
import useUndoState from "../common/useUndoState";
import { DocumentProps } from "@/types/document.type";
import useCheckDemo from "../demo/useCheckDemo";
import useTrashState from "./useTrashState";

export default function useRestoreTrash(trashItem: DocumentProps | Folder) {
    const dispatch = useAppDispatch();

    const undoState = useUndoState();
    const checkDemo = useCheckDemo();
    const { deleteTrashDocument, deleteTrashFolder } = useTrashState();

    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    // 문서를 복원
    const restoreDocument = async () => {
        try {
            // 부모 폴더가 삭제된 경우 복원 불가
            if (foldersTrash.some(folder => folder.id === (trashItem as DocumentProps).folderId)) {
                dispatch(showWarningAlert('해당 문서가 속한 폴더가 휴지통에 있습니다.'));
                return;
            }

            // 휴지통에서 문서를 삭제하고 폴더에서 참조 제거
            deleteTrashDocument(trashItem as DocumentProps);

            // 복원할 문서를 폴더와 전체 문서 목록에 추가
            dispatch(addDocumentToFolder({
                folderId: (trashItem as DocumentProps).folderId,
                docId: trashItem.id,
            }));
            dispatch(addDocuments(trashItem));

            if (!checkDemo()) {
                await axios.post('/api/trash/document', {
                    documentId: trashItem.id,
                    folderId: (trashItem as DocumentProps).folderId,
                });
            }

            dispatch(showCompleteAlert('해당 문서는 복원되었습니다.'));
        } catch (error) {
            // 요청 실패 시 롤백
            undoState();
            dispatch(showWarningAlert('복원에 실패했습니다.'));
        }
    }

    // 폴더를 복원
    const restoreFolder = async () => {
        // 복원할 폴더 내의 모든 문서
        const documentsOfFolder = documentsTrash.filter(doc => (trashItem as Folder).documentIds.includes(doc.id));

        try {
            // 휴지통에서 폴더를 삭제하고 참조 중인 모든 문서 제거
            deleteTrashFolder(trashItem as Folder);

            // 문서 복원
            dispatch(addFolders(trashItem));
            dispatch(addDocuments(documentsOfFolder));

            if (!checkDemo()) {
                await axios.post('/api/trash/folder', {
                    folderId: (trashItem as Folder).id,
                });
            }

            dispatch(showCompleteAlert('해당 폴더는 복원되었습니다.'));
        } catch (error) {
            // 요청 실패 시 롤백
            undoState();

            dispatch(showWarningAlert('복원에 실패했습니다.'));
        }
    }

    return { restoreDocument, restoreFolder };
}