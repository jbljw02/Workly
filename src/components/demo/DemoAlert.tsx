import CommonButton from '../button/CommonButton';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import axios from 'axios';
import { useRouter } from "next-nprogress-bar";
import { showWarningAlert } from '@/redux/features/common/alertSlice';
import useSetInitialDemoUser from '@/hooks/demo/useSetInitialDemoUser';

export default function DemoAlert() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const setInitialDemoUser = useSetInitialDemoUser();

    const [animation, setAnimation] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setAnimation('slide-up');
    }, []);

    // 체험용 데모 사용자를 생성
    const createDemoUser = async () => {
        try {
            const response = await axios.post('/api/auth/user/demo', {
                withCredentials: true
            });

            await setInitialDemoUser(response.data);

            router.push('/demo/home');
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
            className={`fixed bottom-7 right-7 z-50 border rounded-lg shadow-md transition-transform duration-1000
                ${animation === 'slide-up' ? 'translate-y-0' : 'translate-y-[200%]'}`}>
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-3">Workly 체험하기</h2>
                    <p className="text-gray-600">
                        회원가입 없이 Workly를 체험해보세요.
                        <br />
                        체험 모드에서는 이용기록이 남지 않습니다.
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
                        label="로그인 없이 체험해보기"
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