import { useAppSelector } from "@/redux/hooks";
import Cookies from 'js-cookie';

export default function useCheckDemo() {
    const user = useAppSelector(state => state.user);

    const checkDemo = () => {
        const demoToken = Cookies.get('demoToken');
        return Boolean(user.isDemo && !!demoToken);
    }

    return checkDemo;
}