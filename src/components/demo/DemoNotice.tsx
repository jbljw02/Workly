import CommonButton from '../button/CommonButton';
import { useState, useEffect } from 'react';
import { useRouter } from "next-nprogress-bar";
import demoLogout from '@/utils/auth/demoLogout';
import CautionIcon from '../../../public/svgs/caution-triangle.svg';
import { useAppDispatch } from '@/redux/hooks';

export default function DemoNotice() {
    const [animation, setAnimation] = useState('');

    useEffect(() => {
        setAnimation('slide-up');
    }, []);

    const signUp = async () => {
        await demoLogout();
        window.location.href = '/signup';
    }

    const quitDemo = async () => {
        await demoLogout();
        window.location.href = '/';
    }

    return (
        <div
            className={`fixed bottom-7 right-7 z-50 border rounded-lg shadow-md transition-transform 
                ${animation === 'slide-up' ? 'translate-y-0' : 'translate-y-[200%]'}`}>
            <div className="bg-white rounded-xl p-5 w-[400px] shadow-lg">
                <div className="mb-6 text-center space-y-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-neutral-800">
                            현재 체험판을 이용중입니다
                        </span>
                        <span className="text-sm text-neutral-500">
                            서비스 특성상 일부 기능이 제한될 수 있습니다
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                        <CautionIcon width="15.5" />
                        <span>
                            새로고침 또는 탭을 닫으시면 모든 정보가 초기화됩니다!
                        </span>
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <CommonButton
                        style={{
                            width: 'w-full',
                            height: 'h-10',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-600',
                        }}
                        label="회원가입"
                        onClick={signUp}
                    />
                    <CommonButton
                        style={{
                            width: 'w-24',
                            height: 'h-10',
                            textSize: 'text-sm',
                            textColor: 'text-gray-700',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-50',
                            borderColor: 'border-gray-300'
                        }}
                        label="그만두기"
                        onClick={quitDemo}
                    />
                </div>
            </div>
        </div >
    );
}