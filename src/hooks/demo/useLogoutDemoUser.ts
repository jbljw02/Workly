import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname } from 'next/navigation';
import { clearDemoUser } from '@/redux/features/user/userSlice';
import useCheckDemo from './useCheckDemo';
import demoLogout from '@/utils/auth/demoLogout';

// 데모 사용자가 페이지를 떠날 때 토큰 삭제
export default function useLogoutDemoUser() {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

    const isDemo = useAppSelector(state => state.user.isDemo);
    const pathname = usePathname();

    useEffect(() => {
        if (isDemo) {
            // 페이지를 떠날 때(탭 닫기, 브라우저 닫기) 감지
            const beforeUnloadEvent = async () => {
                demoLogout();
            };

            window.addEventListener('beforeunload', beforeUnloadEvent);

            // /demo/* 경로를 벗어났는지 체크
            if (checkDemo() && !pathname?.startsWith('/demo')) {
                demoLogout();

                dispatch(clearDemoUser());
            }

            return () => {
                window.removeEventListener('beforeunload', beforeUnloadEvent);
            };
        }
    }, [isDemo, pathname]);
}