import { showWarningAlert, showCompleteAlert } from "@/redux/features/alertSlice";
import { DocumentProps, publishContent } from "@/redux/features/documentSlice";
import { setWorkingSpinner } from "@/redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import Nprogress from 'nprogress';
import useUpdateContent from '@/components/hooks/useUpdateContent';

export default function usePublishDocument() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const { updateContent } = useUpdateContent();

    const publishDocument = async (selectedDoc: DocumentProps) => {
        try {
            if (selectedDoc.isPublished) {
                dispatch(showWarningAlert('이미 게시된 문서입니다.'));
                return;
            }
            Nprogress.start();
            dispatch(setWorkingSpinner(true));

            await axios.post('/api/publish',
                {
                    docId: selectedDoc.id,
                    user: user,
                    docContent: selectedDoc.docContent,
                });

            await updateContent(selectedDoc); // 게시되기 전에 변경사항 저장

            dispatch(publishContent({ docId: selectedDoc.id, user: user }));
            dispatch(showCompleteAlert('문서 게시에 성공했습니다.'));
        } catch (error) {
            dispatch(showWarningAlert('문서 게시에 실패했습니다.'));
        } finally {
            Nprogress.done();
            dispatch(setWorkingSpinner(false));
        }
    }

    return publishDocument;
}