import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { DocumentProps } from "@/types/document.type";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { doc, getDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { setSelectedDocument, updateDocuments } from "@/redux/features/document/documentSlice";
import { usePathname } from "next/navigation";
import { Editor } from "@tiptap/react";

export default function useUpdateContent(editor: Editor | null) {
    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    // 문서명을 DB에 저장하기 위해 서버로 요청 전송
    // 디바운싱을 이용하여 과도한 요청 방지
    const debouncedUpdateRequest = useCallback(
        debounce(async (latestDoc: DocumentProps) => {
            const docRef = doc(firestore, 'documents', latestDoc.id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists() || !latestDoc.docContent) return;

            try {
                await axios.put('/api/document', {
                    docId: latestDoc.id,
                    newDocName: latestDoc.title,
                });
            } catch (error) {
                dispatch(showWarningAlert('변경사항 저장에 실패하였습니다.'));
            }
        }, 1000),
        []);

    // 즉시 업데이트 요청
    const updateContent = async (latestDoc: DocumentProps) => {
        const docRef = doc(firestore, 'documents', latestDoc.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || !latestDoc.docContent) return;

        await axios.put('/api/document', {
            docId: latestDoc.id,
            newDocName: latestDoc.title,
            newDocContent: latestDoc.docContent,
        });
    };

    // 현재 선택된 문서를 지정
    // documents의 값이 변경될 때마다 현재 선택된 문서의 값도 업데이트
    useEffect(() => {
        const currentDocument = documents.find(doc => doc.id === documentId);
        if (currentDocument) {
            dispatch(setSelectedDocument(currentDocument));
        }
    }, [documents]);

    // 에디터의 내용이 변경될 때마다 state와의 일관성을 유지
    useEffect(() => {
        if (!editor || !selectedDocument) return;

        const updateDocument = async () => {
            const content = editor.getJSON();

            const updatedDoc: DocumentProps = {
                ...selectedDocument,
                docContent: content,
                readedAt: {
                    seconds: Math.floor(Date.now() / 1000),
                    nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
                }
            };

            dispatch(updateDocuments({ docId: updatedDoc.id, ...updatedDoc }));
        };

        editor.on('update', updateDocument);

        return () => {
            editor.off('update', updateDocument);
        };
    }, [editor, selectedDocument, dispatch]);

    return { updateContent, debouncedUpdateRequest };
}