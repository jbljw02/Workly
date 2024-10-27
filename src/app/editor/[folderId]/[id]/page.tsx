import Editor from "@/components/editor/Editor";
import { getAuth } from "firebase/auth";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, firebasedb } from "@/firebase/firebasedb";
import admin from "@/firebase/firebaseAdmin";
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const docId = params.id; // 문서 ID

    // 파이어베이스 인증 토큰 가져오기
    const cookieStore = cookies();
    const firebaseToken = cookieStore.get('authToken');

    if (!firebaseToken) {
        return redirect('/access-denied');
    }

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
