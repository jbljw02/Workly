import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { clearDemoUser } from '@/redux/features/user/userSlice';

// 데모 사용자가 페이지를 떠날 때 토큰 삭제
export default function useLogoutDemoUser() {
    const dispatch = useAppDispatch();
    
    const isDemo = useAppSelector(state => state.user.isDemo);
    const pathname = usePathname();

    useEffect(() => {
        if (isDemo) {
            // 페이지를 떠날 때(탭 닫기, 브라우저 닫기) 감지
            const beforeUnloadEvent = async () => {
                await axios.delete('/api/auth/user/demo', {
                    withCredentials: true
                });
            };

            window.addEventListener('beforeunload', beforeUnloadEvent);

            // /editor/* 경로를 벗어났는지 체크
            if (isDemo && !pathname?.startsWith('/editor')) {
                axios.delete('/api/auth/user/demo', {
                    withCredentials: true
                });

                dispatch(clearDemoUser());
            }

            return () => {
                window.removeEventListener('beforeunload', beforeUnloadEvent);
            };
        }
    }, [isDemo, pathname]);
}