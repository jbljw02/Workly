import Editor from "@/components/editor/Editor";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from "@/firebase/firebaseAdmin";
import axios from 'axios';
import { doc, getDoc } from "firebase/firestore";
import firestore from '@/firebase/firestore';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function EditorPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const docId = params.id;

    console.log('params: ', params);

    // 현재 경로의 문서가 존재하는지 확인
    const docRef = doc(firestore, 'documents', docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return redirect('/document-not-found');
    }

    // 파이어베이스 인증 토큰 가져오기
    const cookieStore = cookies();
    const firebaseToken = cookieStore.get('authToken');

    // 인증되지 않은 사용자라면 접근 제한
    if (!firebaseToken) {
        return redirect('/access-denied');
    }

    // 사용자에게 현재 폴더에 접근 권한이 있는지 확인
    // 권한이 없다면 접근 제한
    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken.value);
        const userEmail = decodedToken.email;

        await axios.get(`${baseUrl}/api/auth/verify-permission`, {
            params: {
                email: userEmail,
                docId: docId,
            },
        });

        return <Editor docId={id} />
    } catch (error) {
        return redirect('/access-denied');
    }
}
