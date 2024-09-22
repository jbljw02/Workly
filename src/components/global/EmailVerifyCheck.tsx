import { clearUser, setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../../firebase/firebasedb";
import getEmailToken from "@/utils/getEmailToken";
import logout from "@/utils/logout";
import { useRouter } from "next/navigation";

export default function EmailVerifyCheck() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // 사용자의 로그인 상태가 변경될 때마다 실행
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log("유저: ", user);
            if (user && user.emailVerified) {
                dispatch(setUser({
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                }))
                getEmailToken();
            }
            else {
                dispatch(clearUser());
            }
        });
    }, [dispatch]);

    // 사용자의 이메일 인증 여부를 체크
    useEffect(() => {
        // 사용자가 페이지를 떠나기 전에 이메일 인증 여부를 확인하고, 미인증 상태라면 강제 로그아웃
        const checkBeforeUnload = async () => {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
                logout(router);
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