import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebasedb";
import { AppDispatch } from "@/redux/store";
import { showWarningAlert } from "@/redux/features/alertSlice";
import NProgress from 'nprogress';

const logout = async (dispatch: AppDispatch) => {
    try {
        await Promise.all([
            signOut(auth),
            axios.post('/api/auth/logout', null)
        ]);

        NProgress.start();
        
        // 절대 경로 사용
        window.location.href = '/';
    } catch (error) {
        dispatch(showWarningAlert('로그아웃에 실패했습니다.'));
    } finally {
        NProgress.done();
    }
}

export default logout;