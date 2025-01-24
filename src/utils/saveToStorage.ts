import { JSONContent } from "@tiptap/react";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

// 문서의 내용을 스토리지로 저장하고 해당 경로를 리턴
const saveToStorage = async (docId: string, content: JSONContent) => {
    const storage = getStorage();
    const contentRef = ref(storage, `documents/${docId}/drafts/content.json`);
    await uploadString(contentRef, JSON.stringify(content));
    const contentUrl = await getDownloadURL(contentRef);
    return contentUrl;
};

export default saveToStorage;