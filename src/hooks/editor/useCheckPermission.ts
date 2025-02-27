import { DocumentProps } from "@/types/document.type";
import { setEditorPermission } from "@/redux/features/document/shareDocumentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useCheckDemo from "../demo/useCheckDemo";

export default function useCheckPermission() {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();
    
    const user = useAppSelector(state => state.user);

    // 해당 문서에 대한 사용자의 권한을 확인
    const checkPermission = (document: DocumentProps) => {
        const collaborator = document.collaborators.find(collaborator => collaborator.email === user.email);

        // 관리자라면 전체 허용으로 반환
        if (document.author.email === user.email) {
            dispatch(setEditorPermission('전체 허용'));
        }
        // 협업자의 권한 반환
        else if (collaborator) {
            dispatch(setEditorPermission(collaborator.authority));
        }
        // 데모 사용자는 전체 허용
        else if (checkDemo()) {
            dispatch(setEditorPermission('전체 허용'));
        }
        else {
            dispatch(setEditorPermission(null));
        }
    };

    return checkPermission;
}
