import { doc, getDoc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/firebase/firestore';
import { deleteObject, getStorage, ref, uploadString } from 'firebase/storage';

// 문서를 게시 - CREATE
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { docId, user, docContent } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!user) return NextResponse.json({ error: "사용자 정보가 제공되지 않음" }, { status: 400 });
        if (!docContent) return NextResponse.json({ error: "문서 내용이 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 스토리지 문서 내용 가져오기
        const storage = getStorage();
        const draftContentRef = ref(storage, `documents/${docId}/drafts/content.json`);
        const draftResponse = await fetch(docSnap.data().contentUrl);
        const draftContent = await draftResponse.json();

        // 문서 게시 전에, 미처 내용이 저장되지 못했을 상황을 대비해서 저장
        if (!draftContent) await uploadString(draftContentRef, JSON.stringify(docContent));

        // 문서 내용을 가져와 스토리지에 업로드
        const publishedContentRef = ref(storage, `documents/${docId}/published/content.json`);
        await uploadString(publishedContentRef, JSON.stringify(draftContent));

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
        const contentRef = ref(storage, `documents/${docId}/published/content.json`);

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