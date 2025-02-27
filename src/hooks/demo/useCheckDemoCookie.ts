import axios from 'axios';
import { useEffect } from 'react';
import useSetInitialDemoUser from './useSetInitialDemoUser';
import useCheckDemo from './useCheckDemo';

export default function useCheckDemoCookie() {
    const setInitialDemoUser = useSetInitialDemoUser();
    const checkDemo = useCheckDemo();
    
    const verifyCookie = async () => {
        try {
            const response = await axios.get('/api/auth/user/demo', {
                withCredentials: true
            });
            const { isDemo } = response.data;

            // 데모 사용자임이 인증됐다면
            if (isDemo) {
                await setInitialDemoUser(response.data);
            }
            return response.data;
        } catch (error) {
            return false;
        }
    }

    useEffect(() => {
        // 이중 상태 적용 방지
        if (!checkDemo()) verifyCookie();
    }, []);
}
