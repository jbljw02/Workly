import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebasedb";

export default async function logout() {
    try {
        await signOut(auth); // Firebase 로그아웃
        await axios.post('/api/auth/logout', null, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });
    } catch (error) {
        throw error;
    }
}