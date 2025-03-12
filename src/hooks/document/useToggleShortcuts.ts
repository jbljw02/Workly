import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { toggleShortcut } from "@/redux/features/document/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DocumentProps } from "@/types/document.type";
import axios from "axios";
import useCheckDemo from "../demo/useCheckDemo";

export default function useToggleShortcuts() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const checkDemo = useCheckDemo();

    const clickShortcut = async (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();
        try {
            dispatch(toggleShortcut({ docId: document.id, email: user.email }));
            if (!checkDemo()) {
                await axios.post('/api/document/shortcuts',
                    {
                        docId: document.id,
                        email: user.email,
                    }
                )
            }
        } catch (error) {
            // 요청에 실패했을 경우 롤백
            dispatch(toggleShortcut({ docId: document.id, email: user.email }));
            dispatch(showWarningAlert('즐겨찾기 상태 변경에 실패했습니다.'))
        }
    }

    return clickShortcut;
}