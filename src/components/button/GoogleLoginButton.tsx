import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import router from 'next/router';
import GoogleIcon from '../../../public/svgs/google.svg';
import { auth } from '../../firebase/firebasedb';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/features/userSlice';
import axios from 'axios';
import { showWarningAlert } from '@/redux/features/alertSlice';
import { useRouter } from 'next-nprogress-bar';
import NProgress from 'nprogress';

export default function GoogleLoginButton() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const googleAuth = async () => {
        const provider = new GoogleAuthProvider();

        try {
            NProgress.start();

            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            // 사용자 정보가 없을 경우 예외 처리
            if (!credential) throw new Error("사용자 인증 정보를 찾을 수 없습니다.");

            const user = result.user;
            const token = await user.getIdToken();

            // 사용자 이름, 이메일, 토큰 확인
            if (!user.displayName) {
                dispatch(showWarningAlert('사용자 이름이 존재하지 않습니다.'));
                throw new Error("사용자 이름이 존재하지 않습니다.");
            }
            if (!user.email) {
                dispatch(showWarningAlert('사용자 이메일이 존재하지 않습니다.'));
                throw new Error("사용자 이메일이 존재하지 않습니다.");
            }
            if (!token) {
                dispatch(showWarningAlert('로그인에 실패했습니다.'));
                throw new Error("사용자 토큰을 생성하지 못했습니다.");
            }

            // 파이어베이스 토큰 인증
            await axios.post('/api/auth/email-token', { token });

            // 사용자의 초기 정보를 설정
            await axios.post('/api/auth/user', { user });

            if (user.displayName && user.email && user.photoURL && user.uid) {
                dispatch(setUser({
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                }))
            }

            router.push('/editor/home');

            return { user: { name: user.displayName, email: user.email } };
        } catch (error) {
            dispatch(showWarningAlert('로그인에 실패했습니다.'));
            throw error;
        } finally {
            NProgress.done();
        }
    };

    return (
        <div className='flex w-full'>
            <button
                onClick={googleAuth}
                className='flex items-center justify-center py-2.5 gap-1 rounded-lg border border-gray-400 w-full'>
                <GoogleIcon />
                <div>구글 계정으로 로그인</div>
            </button>
        </div>
    )
}