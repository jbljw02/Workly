import { useAppDispatch } from '@/redux/hooks';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';

export const useCopyURL = () => {
  const dispatch = useAppDispatch();

  const copyURL = (folderId: string, docId: string) => {
    const baseURL = window.location.origin;
    const documentURL = `${baseURL}/editor/${folderId}/${docId}`;
    navigator.clipboard.writeText(documentURL)
      .then(() => {
        dispatch(showCompleteAlert('링크가 복사되었습니다.'));
      })
      .catch(() => {
        dispatch(showWarningAlert('링크 복사에 실패했습니다. 잠시 후 다시 시도해주세요.'));
      });
  };

  return copyURL;
};