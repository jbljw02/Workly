import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { canclePublishContent, setDocuments } from "@/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";

export default function useCancelPublish() {
    const dispatch = useAppDispatch();
    const documents = useAppSelector(state => state.documents);
    
    const cancelPublish = async (docId: string) => {
        const prevDocs = [...documents];
        try {
            dispatch(canclePublishContent({ docId }));

            await axios.delete('/api/publish', {
                data: { docId }
            });
            dispatch(showCompleteAlert('게시된 문서를 삭제했습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('게시된 문서를 삭제하지 못했습니다.'))

            // 요청 실패 시 롤백
            dispatch(setDocuments(prevDocs));
        }
    }

    return cancelPublish;
}