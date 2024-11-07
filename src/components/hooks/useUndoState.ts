import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { setFoldersTrash, setDocumentsTrash } from "@/redux/features/trashSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const useUndoState = () => {
    const dispatch = useAppDispatch();
    
    const documents = useAppSelector(state => state.documents);
    const folders = useAppSelector(state => state.folders);
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);
    
    // 요청에 실패했을 시 이전 상태로 복원
    const undoState = () => {
        const prevFolders = [...folders];
        const prevDocuments = [...documents];
        const prevFoldersTrash = [...foldersTrash];
        const prevDocumentsTrash = [...documentsTrash];

        dispatch(setFolders(prevFolders));
        dispatch(setDocuments(prevDocuments));
        dispatch(setFoldersTrash(prevFoldersTrash));
        dispatch(setDocumentsTrash(prevDocumentsTrash));
    }

    return undoState;
}

export default useUndoState;