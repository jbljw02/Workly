import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { canclePublishContent } from "@/redux/features/documentSlice";
import { setWorkingSpinner } from "@/redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import Nprogress from 'nprogress';

export default function useCancelPublish() {
    const dispatch = useAppDispatch();

    const cancelPublish = async (docId: string) => {
        try {
            Nprogress.start();
            dispatch(setWorkingSpinner(true));

            await axios.delete('/api/publish', {
                data: { docId }
            });

            dispatch(canclePublishContent({ docId }));
            dispatch(showCompleteAlert('게시된 문서를 삭제했습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('게시된 문서를 삭제하지 못했습니다.'))
        } finally {
            Nprogress.done();
            dispatch(setWorkingSpinner(false));
        }
    }

    return cancelPublish;
}