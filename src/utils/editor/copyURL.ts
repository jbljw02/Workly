import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { AppDispatch } from "@/redux/store";

const copyURL = (url: string, dispatch: AppDispatch) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        dispatch(showCompleteAlert('링크가 복사되었습니다.'));
      })
      .catch(() => {
        dispatch(showWarningAlert('링크 복사에 실패했습니다.'));
      });
  };

export default copyURL;