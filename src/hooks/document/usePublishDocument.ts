import { showWarningAlert, showCompleteAlert } from "@/redux/features/common/alertSlice";
import { DocumentProps } from "@/types/document.type";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import Nprogress from 'nprogress';
import useUpdateContent from '@/hooks/editor/useUpdateContent';
import { publishContent } from "@/redux/features/document/documentSlice";

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
            if (!selectedDoc.title) {
                dispatch(showWarningAlert('문서 게시 전 제목을 입력해주세요.'));
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