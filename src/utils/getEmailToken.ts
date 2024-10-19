import axios from "axios";
import { auth } from "../../firebase/firebasedb";

const getEmailToken = async () => {
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        await axios.post('/api/auth/emailToken', { token });
    }
}

export default getEmailToken;