import { NextRequest, NextResponse } from 'next/server';
import firestore from '../../../../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Collaborator, DocumentProps } from '@/redux/features/documentSlice';

// 문서에 대한 접근 권한을 확인
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const email = searchParams.get('email');
        const docId = searchParams.get('docId');

        if (!email) return NextResponse.json({ error: "접근 사용자 이메일 존재 X" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID 존재 X" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!userDocSnap.exists()) return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        if (!docSnap.exists()) return NextResponse.json({ error: "문서 정보 존재 X" }, { status: 404 });

        // 접근중인 문서의 정보
        const targetDoc = docSnap.data() as DocumentProps;
        // 접근중인 사용자가 관리자 혹은 협업자여야 함
        const isValidAccess = targetDoc?.collaborators.find((collaborator: Collaborator) =>
            collaborator.email === email) || targetDoc?.author.email === email;

        if (isValidAccess) {
            return NextResponse.json({ isValidAccess }, { status: 200 });
        }
        else {
            return NextResponse.json({ isValidAccess }, { status: 403 });
        }

    } catch (error) {
        return NextResponse.json({ error: "Tiptap 토큰 생성 실패" }, { status: 500 });
    }
}
