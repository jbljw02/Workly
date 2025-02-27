import { DocumentProps } from "@/types/document.type";
import { Folder } from "@/types/folder.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateDocuments } from "@/redux/features/document/documentSlice";
import { removeDocumentFromFolder, addDocumentToFolder } from "@/redux/features/folder/folderSlice";
import axios from "axios";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import useCheckDemo from "../demo/useCheckDemo";

export function useDocumentMove(selectedDoc: DocumentProps, setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>) {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

    const folders = useAppSelector(state => state.folders);

    // 문서의 폴더를 이동
    const moveDoc = async (targetFolder: Folder) => {
        // 현재 폴더를 클릭하면 경고
        if (targetFolder.id === selectedDoc.folderId) {
            return { isCurrentFolder: true };
        }

        else {
            // 나머지 값은 유지하고, 폴더 이름과 ID만 변경
            const newDoc: DocumentProps = {
                ...selectedDoc,
                folderName: targetFolder.name,
                folderId: targetFolder.id,
            }

            try {
                // 전체 문서중에 변경할 문서의 폴더 이름을 변경
                dispatch(updateDocuments({ docId: selectedDoc.id, ...newDoc }));

                // 기존 폴더에서 문서 ID를 삭제하고, 새 폴더에 문서 ID를 추가
                dispatch(removeDocumentFromFolder({ folderId: selectedDoc.folderId, docId: newDoc.id }));
                dispatch(addDocumentToFolder({ folderId: targetFolder.id, docId: newDoc.id }));

                setIsModalOpen?.(false);

                if (!checkDemo()) {
                    await axios.put('/api/document/move',
                        {
                            folderId: targetFolder.id,
                            document: selectedDoc
                        });
                }

                dispatch(showCompleteAlert('문서를 성공적으로 이동했습니다.'))
            } catch (error) {
                dispatch(showWarningAlert('문서를 이동하는 데에 실패했습니다.'))
            }
        }
    }

    return { moveDoc, folders };
}