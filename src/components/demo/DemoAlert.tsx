import Link from 'next/link';
import CommonButton from '../button/CommonButton';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDemoUser } from '@/redux/features/user/userSlice';
import axios from 'axios';
import { useRouter } from "next-nprogress-bar";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { showWarningAlert } from '@/redux/features/common/alertSlice';

export default function DemoAlert() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [animation, setAnimation] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAnimation('slide-up');
        }, 200);
    }, []);

    const createDemoUser = async () => {
        try {
            const response = await axios.post('/api/auth/user/demo', {
                withCredentials: true
            });

            // 아바타 프로필 다운로드
            const storage = getStorage();
            const avatarRef = ref(storage, 'profile/avatar.png');
            const avatarURL = await getDownloadURL(avatarRef);

            dispatch(setDemoUser({
                uid: response.data.uid,
                photoURL: avatarURL,
            }));
            router.push('/editor/home');
        } catch (error) {
            dispatch(showWarningAlert('죄송합니다. 잠시 후 다시 시도해주세요.'));
        }
    }

    const closeAlert = () => {
        setAnimation('slide-down');
        setTimeout(() => setIsOpen(false), 500);
    };

    return (
        <div
            className={`${animation} fixed bottom-7 right-7 z-50 border rounded-lg shadow-md transition-transform 
                ${animation === 'slide-up' ? 'translate-y-0' : 'translate-y-[200%]'}`}
        >
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-3">서비스 체험하기</h2>
                    <p className="text-gray-600">
                        회원가입 없이 30분 동안 서비스를 체험해보세요.
                        <br />
                        체험판에서 작성한 문서는 저장되지 않습니다.
                    </p>
                </div>

                <div className="flex flex-row gap-3">
                    <CommonButton
                        style={{
                            width: 'w-full',
                            height: 'h-11',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-600',
                        }}
                        label="비회원으로 체험해보기"
                        onClick={createDemoUser}
                    />
                    <CommonButton
                        style={{
                            width: 'w-24',
                            height: 'h-11',
                            textSize: 'text-base',
                            textColor: 'text-gray-700',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-50',
                            borderColor: 'border-gray-300'
                        }}
                        label="닫기"
                        onClick={closeAlert}
                    />
                </div>
            </div>
        </div>
    );
}