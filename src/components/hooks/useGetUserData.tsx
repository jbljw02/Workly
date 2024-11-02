import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";


export default function useGetUserData() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    // 사용자의 전체 문서 요청
    const getUserDocument = async () => {
        const response = await axios.get('/api/document', {
            params: { email: user.email }
        });
        dispatch(setDocuments(response.data));
    }

    // 사용자의 전체 폴더 요청
    const getUserFolder = async () => {
        const response = await axios.get('/api/folder', {
            params: { email: user.email },
        });
        dispatch(setFolders(response.data));
    }

    useEffect(() => {
        const getUserData = async () => {
            if (user.email) {
                await getUserDocument();
                await getUserFolder();
            }
        }
        getUserData();
    }, [user.email]);

    return null;
}