import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import admin from '../../../../../firebase/firebaseAdmin';
import { cookies } from 'next/headers';
import firestore from '../../../../../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Collaborator, DocumentProps } from '@/redux/features/documentSlice';

// Tiptap 협업을 위한 JWT 토큰을 생성
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const userEmail = searchParams.get('userEmail');
        const authorEmail = searchParams.get('authorEmail');
        const docId = searchParams.get('docId');

        if (!userEmail) return NextResponse.json({ error: "접근 사용자 이메일 존재 X" }, { status: 400 });
        if (!authorEmail) return NextResponse.json({ error: "문서 관리자 이메일 존재 X" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID 존재 X" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', authorEmail);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);
        const targetDoc = docSnap.data() as DocumentProps;
        const emailCheck = targetDoc?.collaborators.find((collaborator: Collaborator) => collaborator.email === userEmail);
        if(emailCheck) {
           console.log("있음") 
        }
        else {
            console.log("없음")
        }

        if (!docSnap.exists()) return NextResponse.json({ error: "문서 정보 존재 X" }, { status: 404 });

        // 쿠키 저장소에서 Firebase 인증 토큰을 가져옴
        const cookieStore = cookies();
        const firebaseToken = cookieStore.get('authToken');

        if (!firebaseToken) return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });

        // Firebase 토큰을 검증하고 디코딩
        const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken.value);

        // 문서 작성자이거나 협업자인 경우에만 토큰 생성
        if (userEmail === authorEmail) {
            const tiptapJwtData = {
                sub: decodedFirebaseToken.uid,
                name: decodedFirebaseToken.name,
                email: decodedFirebaseToken.email,
            };

            // Tiptap JWT 생성
            const tiptapJwt = jwt.sign(tiptapJwtData, process.env.TIPTAP_JWT_SECRET!);

            return NextResponse.json({ tiptapToken: tiptapJwt }, { status: 200 });
        } else {
            return NextResponse.json({ error: "문서에 대한 접근 권한이 없습니다" }, { status: 403 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Tiptap 토큰 생성 실패" }, { status: 500 });
    }
}
