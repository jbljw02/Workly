import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { addDocuments, deleteDocuments, DocumentProps } from "@/redux/features/documentSlice";
import { addDocumentToFolder } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export default function useCopyDocument() {
    const dispatch = useAppDispatch();
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const copyDoc = async (doc: DocumentProps) => {
        const copiedDocument: DocumentProps = {
            ...doc,
            id: uuidv4(), // 사본이지만 ID는 중복되면 안 되기에 새로 생성
        }

        try {
            // 전체 문서 배열에 추가
            dispatch(addDocuments(copiedDocument));
            // 문서 ID를 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: copiedDocument.folderId, docId: copiedDocument.id }));

            // tiptap cloud에 문서 복사
            await axios.post('/api/tiptap-document', {
                docName: copiedDocument.id,
                docContent: copiedDocument.docContent
            });

            // 파이어베이스에 문서 복사
            await axios.post('/api/document', {
                folderId: copiedDocument.folderId,
                document: copiedDocument
            });

            dispatch(showCompleteAlert(`${copiedDocument.folderName}에 ${selectedDocument.title || '제목 없는 문서'} 사본이 생성되었습니다.`));
        } catch (error) {
            console.error(error);

            // 문서 복사 실패 시 롤백
            dispatch(deleteDocuments(copiedDocument.id));
            dispatch(showWarningAlert(`${selectedDocument.title || '제목 없는 문서'}의 사본 생성에 실패했습니다. 잠시 후 다시 시도해주세요.`));
        }
    }

    return copyDoc;
}