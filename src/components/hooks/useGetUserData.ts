import { setFailedAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { setDocumentLoading, setFolderLoading } from "@/redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 데이터를 새로고침할 경로 목록
const REFRESH_PATHS = [
    '/editor/home',
    '/editor/document',
    '/editor/shared',
    '/editor/published',
    '/editor/shortcuts'
];

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

    // 사용자의 전체 문서 요청
    const getUserDocument = async () => {
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
    }

    // 사용자의 전체 폴더 요청
    const getUserFolder = async () => {
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
    }

    const getUserData = async () => {
        if (!user.email || isDeleting || !shouldRefresh) {
            return;
        }

        try {
            await getUserDocument();
            await getUserFolder();
        } catch (error) {
            dispatch(showWarningAlert('사용자의 데이터를 불러오는 데 실패했습니다.'))
            dispatch(setFailedAlert(true));
        }
    }

    useEffect(() => {
        getUserData();
    }, [user.email, pathname, isDeleting]);

    return getUserData;
}