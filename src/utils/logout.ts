import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebasedb";
import { useRouter } from "next-nprogress-bar";
import { AppDispatch } from "@/redux/store";
import { showWarningAlert } from "@/redux/features/alertSlice";

const logout = async (router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    try {
        // 먼저 로그아웃 처리를 완료
        await Promise.all([
            signOut(auth),
            axios.post('/api/auth/logout', null)
        ]);

        // 로그아웃이 완료된 후 라우팅
        router.push('/');
    } catch (error) {
        dispatch(showWarningAlert('로그아웃에 실패했습니다.'));
    }
}

export default logout;