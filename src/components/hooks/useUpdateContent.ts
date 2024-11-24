import { debounce } from "lodash";
import { useCallback } from "react";
import axios from "axios";
import { DocumentProps } from "@/redux/features/documentSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import firestore from "@/firebase/firestore";
import { getDoc, doc } from "firebase/firestore";

export default function useUpdateContent() {
    const dispatch = useAppDispatch();

    // 문서명을 DB에 저장하기 위해 서버로 요청 전송
    // 디바운싱을 이용하여 과도한 요청 방지
    const debouncedUpdateRequest = useCallback(
        debounce(async (latestDoc: DocumentProps) => {
            if (!latestDoc) return;

            try {
                await axios.put('/api/document', {
                    docId: latestDoc.id,
                    newDocName: latestDoc.title,
                });
            } catch (error) {
                console.error(error);
                dispatch(showWarningAlert('변경사항 저장에 실패하였습니다.'));
            }
        }, 1000),
        []);

    // 즉시 업데이트 요청
    const updateContent = async (latestDoc: DocumentProps) => {
        if (!latestDoc) return;

        console.log('latestDoc: ', latestDoc);

        try {
            await axios.put('/api/document', {
                docId: latestDoc.id,
                newDocName: latestDoc.title,
                newDocContent: latestDoc.docContent,
            });
        } catch (error) {
            console.error(error);
            dispatch(showWarningAlert('변경사항 저장에 실패하였습니다.'));
        }
    };


    return { updateContent, debouncedUpdateRequest };
}