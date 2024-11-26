import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { AppDispatch } from "@/redux/store";

const copyURL = (folderId: string, docId: string, dispatch: AppDispatch) => {
    const baseURL = window.location.origin;
    const documentURL = `${baseURL}/editor/${folderId}/${docId}`;
    navigator.clipboard.writeText(documentURL)
      .then(() => {
        dispatch(showCompleteAlert('링크가 복사되었습니다.'));
      })
      .catch(() => {
        dispatch(showWarningAlert('링크 복사에 실패했습니다.'));
      });
  };

export default copyURL;