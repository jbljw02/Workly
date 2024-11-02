import { debounce } from "lodash";
import { useCallback } from "react";
import axios from "axios";
import { DocumentProps } from "@/redux/features/documentSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function useUploadTitle() {
    const dispatch = useAppDispatch();

    // 문서명을 DB에 저장하기 위해 서버로 요청 전송
    // 디바운싱을 이용하여 과도한 요청 방지
    const updateRequest = useCallback(
        debounce(async (latestDoc) => {
            if (!latestDoc) return;

            try {
                await axios.put('/api/document',
                    {
                        docId: latestDoc.id,
                        newDocName: latestDoc.title,
                    });
            } catch (error) {
                console.error(error);
                dispatch(showWarningAlert('문서명 변경에 실패하였습니다.'));
            }
        }, 1000), []);

    const uploadTitle = useCallback(async (latestDoc: DocumentProps) => {
        updateRequest(latestDoc);
    }, [updateRequest]);

    return uploadTitle;
}
