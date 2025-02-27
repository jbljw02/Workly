import { DocumentProps } from "@/types/document.type";
import { Folder } from "@/types/folder.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import useTrashState from "./useTrashState";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trash/trashSlice";
import useCheckDemo from "../demo/useCheckDemo";

export default function useDeleteTrash(setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) {
    const dispatch = useAppDispatch();

    const { deleteTrashDocument, deleteTrashFolder } = useTrashState();
    const checkDemo = useCheckDemo();

    const user = useAppSelector(state => state.user);
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    // 문서를 영구 삭제
    const deleteDocumentPermanently = async (document: DocumentProps) => {
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];

        try {
            // 휴지통에서 문서를 삭제하고 폴더에서 참조 제거
            deleteTrashDocument(document);

            setIsModalOpen(false);

            if (!checkDemo()) {
                // 파이어베이스에서 문서 삭제
                await axios.delete('/api/trash/document', {
                    params: {
                        docId: document.id,
                        folderId: document.folderId,
                    }
                });
            }

            dispatch(showCompleteAlert('해당 문서는 영구적으로 삭제되었습니다.'));
        } catch (error) {
            dispatch(showWarningAlert('삭제에 실패했습니다.'));

            // 삭제 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
        }
    }

    // 폴더를 영구 삭제
    const deleteFolderPermanently = async (folder: Folder) => {
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];

        try {
            // 휴지통에서 폴더를 삭제하고 참조 중인 모든 문서 제거
            deleteTrashFolder(folder);

            setIsModalOpen(false);

            if (!checkDemo()) {
                // 파이어베이스에서 폴더와 관련 문서 삭제
                await axios.delete('/api/trash/folder', {
                    params: {
                        email: user.email,
                        folderId: folder.id,
                    }
                });
            }

            dispatch(showCompleteAlert('해당 폴더는 영구적으로 삭제되었습니다.'));
        } catch (error) {
            dispatch(showWarningAlert('삭제에 실패했습니다.'));

            // 삭제 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
        }
    }

    return { deleteDocumentPermanently, deleteFolderPermanently };
}