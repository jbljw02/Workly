import { DocumentProps } from "@/types/document.type";
import { setEditorPermission } from "@/redux/features/document/shareDocumentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function useCheckPermission() {
    const dispatch = useAppDispatch();

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
        else {
            dispatch(setEditorPermission(null));
        }
    };

    return checkPermission;
}
