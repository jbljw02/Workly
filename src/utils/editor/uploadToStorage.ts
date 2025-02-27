import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 스토리지에 파일/이미지 업로드
const uploadToStorage = async (file: File | Blob, href: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, href);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

export default uploadToStorage;