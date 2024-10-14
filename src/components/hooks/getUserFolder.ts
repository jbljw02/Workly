import { setFolders } from "@/redux/features/folderSlice";
import { AppDispatch } from "@/redux/store";
import axios from 'axios';

// 사용자의 전체 폴더를 요청
const getUserFolder = async (email: string, dispatch: AppDispatch) => {
    const response = await axios.get('/api/folder', {
        params: { email },
    });

    dispatch(setFolders(response.data));
}

export default getUserFolder;