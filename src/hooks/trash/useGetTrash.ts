import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { setTrashLoading } from "@/redux/features/common/placeholderSlice";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trash/trashSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useEffect } from "react";
import useCheckDemo from "../demo/useCheckDemo";

export default function useGetTrash() {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

    const user = useAppSelector(state => state.user);
    
    // 휴지통에 있는 문서들을 가져옴
    const getTrashDocuments = async () => {
        try {
            dispatch(setTrashLoading(true));

            const response = await axios.get('/api/trash/document', {
                params: { email: user.email }
            })
            dispatch(setDocumentsTrash(response.data));
        } catch (error) {
            dispatch(showWarningAlert('휴지통의 정보를 불러오는 데에 실패했습니다.'));
        } finally {
            dispatch(setTrashLoading(false));
        }
    }

    // 휴지통에 있는 폴더들을 가져옴
    const getTrashFolders = async () => {
        try {
            const response = await axios.get('/api/trash/folder', {
                params: { email: user.email }
            })
            dispatch(setFoldersTrash(response.data));
        } catch (error) {
            dispatch(showWarningAlert('휴지통의 정보를 불러오는 데에 실패했습니다.'));
        }
    }

    useEffect(() => {
        if (!user.email || checkDemo()) return;
        getTrashDocuments();
        getTrashFolders();
    }, [user.email]);
}