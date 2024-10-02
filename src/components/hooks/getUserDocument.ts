import { setDocuments } from "@/redux/features/documentSlice";
import { setFolders } from "@/redux/features/folderSlice";
import { AppDispatch } from "@/redux/store";
import axios from 'axios';

// 사용자의 전체 문서 요청
const getUserDocument = async (email: string, dispatch: AppDispatch) => {
    const response = await axios.get('/api/document', {
        params: { email },
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    });
    dispatch(setDocuments(response.data));
}

export default getUserDocument;