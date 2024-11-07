import { showWarningAlert } from "@/redux/features/alertSlice";
import { DocumentProps, toggleShortcut } from "@/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";

export default function useToggleShortcuts() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const clickShortcut = async (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();
        try {
            dispatch(toggleShortcut({ docId: document.id, email: user.email }));
            await axios.post('/api/document/shortcuts',
                {
                    docId: document.id,
                    email: user.email,
                }
            )
        } catch (error) {
            console.log(error);
            // 요청에 실패했을 경우 롤백
            dispatch(toggleShortcut({ docId: document.id, email: user.email }));
            dispatch(showWarningAlert('즐겨찾기 상태 변경에 실패했습니다.'))
        }
    }

    return clickShortcut;
}