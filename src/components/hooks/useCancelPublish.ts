import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";

export default function useCancelPublish() {
    const dispatch = useAppDispatch();
    
    const cancelPublish = async (docId: string) => {
        try {
            await axios.delete('/api/publish', {
                data: { docId }
            });
            dispatch(showCompleteAlert('문서의 게시를 취소했습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('문서의 게시를 취소하지 못했습니다.'));
        }
    }

    return cancelPublish;
}