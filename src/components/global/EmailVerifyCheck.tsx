import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../../firebase/firebasedb";
import getEmailToken from "@/utils/getEmailToken";
import logout from "@/utils/logout";

export default function EmailVerifyCheck() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    console.log(user);

    // 사용자의 로그인 상태가 변경될 때마다 실행
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log("상태 확인");
            if (user && user.emailVerified) {
                console.log("이메일 인증 완료");
                dispatch(setUser({
                    name: user.displayName,
                    email: user.email,
                }));
                getEmailToken();
            }
        });
    }, [dispatch]);

    // 사용자의 이메일 인증 여부를 체크
    useEffect(() => {
        // 사용자가 페이지를 떠나기 전에 이메일 인증 여부를 확인하고, 미인증 상태라면 강제 로그아웃
        const checkBeforeUnload = async () => {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
                console.log("로그아웃");
                logout();
            }
        };

        window.addEventListener('beforeunload', checkBeforeUnload);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', checkBeforeUnload);
        };
    }, []);

    return null;
}