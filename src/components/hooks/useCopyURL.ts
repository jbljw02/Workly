import { useAppDispatch } from '@/redux/hooks';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';

export const useCopyURL = () => {
  const dispatch = useAppDispatch();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL)
      .then(() => {
        dispatch(showCompleteAlert('링크가 복사되었습니다.'));
      })
      .catch((error) => {
        dispatch(showWarningAlert('링크 복사에 실패했습니다.'))
      });
  };

  return { copyURL};
};