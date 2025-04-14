import { setFailedAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { setFolders } from "@/redux/features/folder/folderSlice";
import { setDocumentLoading, setFolderLoading } from "@/redux/features/common/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setDocuments } from "@/redux/features/document/documentSlice";
import { AppDispatch } from "@/redux/store";
import { UserProps } from "@/types/user.type";

// 데이터를 새로고침할 경로 목록
const REFRESH_PATHS = [
    '/editor/home',
    '/editor/document',
    '/editor/shared',
    '/editor/published',
    '/editor/shortcuts'
];

// 문서 데이터 가져오기
const getUserDocument = async (dispatch: AppDispatch, user: UserProps) => {
    try {
        dispatch(setDocumentLoading(true));
        const response = await axios.get('/api/document', {
            params: { email: user.email }
        });
        dispatch(setDocuments(response.data));
    } catch (error) {
        throw error;
    } finally {
        dispatch(setDocumentLoading(false));
    }
};

// 폴더 데이터 가져오기
const getUserFolder = async (dispatch: AppDispatch, user: UserProps) => {
    try {
        dispatch(setFolderLoading(true));
        const response = await axios.get('/api/folder', {
            params: { email: user.email },
        });
        dispatch(setFolders(response.data));
    } catch (error) {
        throw error;
    } finally {
        dispatch(setFolderLoading(false));
    }
};

// 사용자 데이터 가져오기
export const getUserData = async (dispatch: AppDispatch, user: UserProps, isDeleting: boolean, shouldRefresh?: boolean) => {
    if (!user.email || isDeleting || !shouldRefresh) return;

    try {
        await getUserDocument(dispatch, user);
        await getUserFolder(dispatch, user);
    } catch (error) {
        dispatch(showWarningAlert('사용자의 데이터를 불러오는 데 실패했습니다.'))
        dispatch(setFailedAlert(true));
    }
};

// 마운트, 경로 변경 시 데이터 가져오기
export default function useGetUserData() {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const user = useAppSelector(state => state.user);
    const isDeleting = useAppSelector(state => state.loading.isDeleting);
    const documents = useAppSelector(state => state.documents);
    const folders = useAppSelector(state => state.folders);

    // 즉시 문서 편집 페이지로 접속했을 상황을 고려해, 문서 혹은 폴더 데이터가 비어있는 경우 새로고침
    const shouldRefresh = pathname.startsWith('/editor') &&
        (REFRESH_PATHS.includes(pathname) || documents.length === 0 || folders.length === 0);

    useEffect(() => {
        getUserData(dispatch, user, isDeleting, shouldRefresh);
    }, [user.email, pathname, isDeleting]);
}