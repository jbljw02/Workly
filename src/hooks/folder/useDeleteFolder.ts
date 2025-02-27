import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { deleteAllDocumentsOfFolder } from "@/redux/features/document/documentSlice";
import { deleteFolders } from "@/redux/features/folder/folderSlice";
import { addFoldersToTrash, addDocumentsToTrash } from "@/redux/features/trash/trashSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import useUndoState from "../common/useUndoState";
import useCheckDemo from "../demo/useCheckDemo";
import { Folder } from "@/types/folder.type";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

export default function useDeleteFolder(folder: Folder) {
    const dispatch = useAppDispatch();
    const undoState = useUndoState();
    const checkDemo = useCheckDemo();
    const router = useRouter();
    
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const documents = useAppSelector(state => state.documents);
    const user = useAppSelector(state => state.user);

    // 폴더 삭제 요청
    const deleteFolder = async () => {
        // 폴더 내의 문서들
        const documentsOfFolder = documents.filter(doc => folder.documentIds.includes(doc.id));

        try {
            // 폴더와 폴더 내의 모든 문서를 삭제
            dispatch(deleteFolders(folder.id));
            dispatch(deleteAllDocumentsOfFolder(folder.id));

            // 삭제된 폴더와 문서들을 휴지통에 추가
            dispatch(addFoldersToTrash(folder));
            dispatch(addDocumentsToTrash(documentsOfFolder));

            if (documentsOfFolder.some(doc => doc.id === documentId)) {
                router.push(`/${checkDemo() ? 'demo' : 'editor'}/home`);
            }

            if (!checkDemo()) {
                // 폴더 삭제 요청
                await axios.delete('/api/folder', {
                    params: {
                        email: user.email,
                        folderId: folder.id,
                    }
                });
            }

            dispatch(showCompleteAlert(`${folder.name}의 삭제를 완료했습니다.`));
        } catch (error) {
            // 삭제에 실패하면 롤백
            undoState();
            dispatch(showWarningAlert(`${folder.name}의 삭제에 실패했습니다.`));
        }
    }

    return { deleteFolder };
}