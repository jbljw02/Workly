import { showWarningAlert, showCompleteAlert } from "@/redux/features/alertSlice";
import { DocumentProps, publishContent } from "@/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";

export default function usePublishDocument() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    
    const publishDocument = async (selectedDoc: DocumentProps) => {
        try {
            if (selectedDoc.isPublished) {
                dispatch(showWarningAlert('이미 게시된 문서입니다.'));
                return;
            }
            
            await axios.post('/api/publish',
                {
                    docId: selectedDoc.id,
                    user: user,
                });

            dispatch(publishContent(selectedDoc.id));
            dispatch(showCompleteAlert('문서 게시에 성공했습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('문서 게시에 실패했습니다.'));
        }
    }

    return publishDocument;
}