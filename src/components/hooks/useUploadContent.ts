import { debounce } from "lodash";
import { useCallback } from "react";
import axios from "axios";
import { DocumentProps } from "@/redux/features/documentSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { connectStorageEmulator } from "firebase/storage";

export default function useUploadContent() {
    const dispatch = useAppDispatch();

    // 에디터의 값을 DB에 저장하기 위해 서버로 요청 전송
    // 디바운싱을 이용하여 과도한 요청 방지
    const editorUpdatedRequest = useCallback(
        debounce(async (latestDoc) => {
            if (!latestDoc) return;

            try {
                await axios.put('/api/document',
                    {
                        docId: latestDoc.id,
                        newDocName: latestDoc.title,
                        newDocContent: latestDoc.docContent
                    });
            } catch (error) {
                console.error(error);
            }
        }, 1000), []);

    const uploadContent = useCallback(async (latestDoc: DocumentProps) => {
        try {
            editorUpdatedRequest(latestDoc);
        } catch (error) {
            console.error(error);
            dispatch(showWarningAlert('변경사항 저장에 실패하였습니다.'));
        }
    }, [editorUpdatedRequest]);

    return uploadContent;
}
