import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function useGetUserData() {
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const user = useAppSelector(state => state.user);

    // 사용자의 전체 문서 요청
    const getUserDocument = async () => {
        try {
            const response = await axios.get('/api/document', {
                params: { email: user.email }
            });
            dispatch(setDocuments(response.data));
        } catch (error) {
            console.error(error);
        }
    }

    // 사용자의 전체 폴더 요청
    const getUserFolder = async () => {
        try {
            const response = await axios.get('/api/folder', {
                params: { email: user.email },
            });
            dispatch(setFolders(response.data));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const getUserData = async () => {
            if (user.email) {
                try {
                    await getUserDocument();
                    await getUserFolder();
                } catch (error) {
                    console.error(error);
                }
            }
        }
        getUserData();
    }, [user.email, pathname]);

    return null;
}