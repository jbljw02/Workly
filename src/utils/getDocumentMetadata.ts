import firestore from "@/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

// 페이지의 메타데이터를 문서명으로 설정하기 위한 함수
export async function getDocumentMetadata(docId: string) {
    const docRef = doc(firestore, 'documents', docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }
    
    const docData = docSnap.data();
    return {
        title: docData.title || '제목 없는 문서'
    };
}