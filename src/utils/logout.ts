import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebasedb";
import { useRouter } from "next-nprogress-bar";
import { AppDispatch } from "@/redux/store";
import { showWarningAlert } from "@/redux/features/alertSlice";

const logout = async (router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    try {
        router.push('/');
        await signOut(auth);
        await axios.post('/api/auth/logout', null);
    } catch (error) {
        dispatch(showWarningAlert('로그아웃에 실패했습니다.'));
    }
}

export default logout;