import { doc, getDoc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/firebase/firestore';
import { deleteObject, getStorage, ref, uploadString } from 'firebase/storage';

// 문서를 게시 - CREATE
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { docId, user } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!user) return NextResponse.json({ error: "사용자 정보가 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 문서 내용을 가져와 스토리지에 업로드
        const storage = getStorage();
        const contentRef = ref(storage, `documents/published/${docId}/content.json`);
        const response = await fetch(docSnap.data().contentUrl);
        const content = await response.json();

        await uploadString(contentRef, JSON.stringify(content));

        await updateDoc(docRef, {
            isPublished: true,
            publishedUser: user,
            publishedDate: serverTimestamp(),
        });

        return NextResponse.json({ message: "문서 게시 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 게시 실패" }, { status: 500 });
    }
}

// 문서 게시 취소 - DELETE
export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        const { docId } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        const storage = getStorage();
        const contentRef = ref(storage, `documents/published/${docId}/content.json`);

        await deleteObject(contentRef);

        await updateDoc(docRef, {
            isPublished: false,
            publishedUser: null,
            publishedDate: null
        });

        return NextResponse.json({ message: "문서 게시 취소 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 게시 취소 실패" }, { status: 500 });
    }
}