import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebasedb";
import { useRouter } from "next/navigation";

const logout = async (router: ReturnType<typeof useRouter>) => {
    try {
        await signOut(auth);
        await axios.post('/api/auth/logout', null, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });
        router.push('/');
    } catch (error) {
        throw error;
    }
}

export default logout;