import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebasedb";
import { useRouter } from "next-nprogress-bar";

const logout = async (router: ReturnType<typeof useRouter>) => {
    try {
        await signOut(auth);
        router.push('/');
        await axios.post('/api/auth/logout', null);
    } catch (error) {
        throw error;
    }
}

export default logout;