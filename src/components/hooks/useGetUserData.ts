import { setFailedAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { setDocumentLoading, setFolderLoading } from "@/redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function useGetUserData() {
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const user = useAppSelector(state => state.user);
    const isDeleting = useAppSelector(state => state.loading.isDeleting);

    // 사용자의 전체 문서 요청
    const getUserDocument = async () => {
        try {
            const response = await axios.get('/api/doccument', {
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
        if (user.email && !isDeleting) {
            try {
                await getUserDocument();
                await getUserFolder();
            } catch (error) {
                dispatch(showWarningAlert('사용자의 데이터를 불러오는 데 실패했습니다.'))
                dispatch(setFailedAlert(true));
                throw error;
            } finally {
                dispatch(setDocumentLoading(false));
                dispatch(setFolderLoading(false));
            }
        }
    }

    useEffect(() => {
        getUserData();
    }, [user.email, pathname, isDeleting]);

    return getUserData;
}