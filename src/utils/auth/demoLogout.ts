import axios from 'axios';

const demoLogout = async () => {
    await axios.delete('/api/auth/user/demo', {
        withCredentials: true
    });
}

export default demoLogout;