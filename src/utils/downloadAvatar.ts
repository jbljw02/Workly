import { getDownloadURL, getStorage, ref } from "firebase/storage";

// 아바타 프로필 다운로드
const downloadAvatar = async () => {
    const storage = getStorage();
    const avatarRef = ref(storage, 'profile/avatar.png');
    const avatarURL = await getDownloadURL(avatarRef);
    return avatarURL;
}

export default downloadAvatar;
