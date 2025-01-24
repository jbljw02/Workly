import { debounce } from "lodash";
import { useCallback } from "react";
import axios from "axios";
import { DocumentProps } from "@/redux/features/documentSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { doc, getDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";

export default function useUpdateContent() {
    const dispatch = useAppDispatch();

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

    return { updateContent, debouncedUpdateRequest };
}