import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import router from 'next/router';
import GoogleIcon from '../../../public/svgs/google.svg';
import { auth } from '../../../firebase/firebasedb';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/features/userSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const googleAuth = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            // 사용자 정보가 없을 경우 예외 처리
            if (!credential) throw new Error("사용자 인증 정보를 찾을 수 없습니다.");

            const user = result.user;
            const token = await user.getIdToken();

            // 사용자 이름, 이메일, 토큰 확인
            if (!user.displayName) throw new Error("사용자 이름이 존재하지 않습니다.");
            if (!user.email) throw new Error("사용자 이메일이 존재하지 않습니다.");
            if (!token) throw new Error("사용자 토큰을 생성하지 못했습니다.");

            // 파이어베이스 토큰 인증
            await axios.post('/api/auth/googleToken', { token }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            });

            dispatch(setUser({
                name: user.displayName,
                email: user.email,
            }))
            router.push('/');
            
            return { user: { name: user.displayName, email: user.email } };
        } catch (error) {
            throw error;
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