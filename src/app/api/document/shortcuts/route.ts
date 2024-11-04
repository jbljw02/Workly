import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";

// 즐겨찾기 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { docId, email } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 아이디가 제공되지 않음" }, { status: 400 });
        if (!email) return NextResponse.json({ error: "사용자 이메일이 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 참조 문서의 즐겨찾기 목록에 사용자 이메일 추가
        const documentData = docSnap.data();
        
        // 이미 즐겨찾기에 존재하면 제거, 없으면 추가
        documentData.shortcutsUsers = documentData.shortcutsUsers.includes(email) ?
            documentData.shortcutsUsers.filter((userEmail: string) => userEmail !== email) :
            [...documentData.shortcutsUsers, email];

        await setDoc(docRef, documentData);

        return NextResponse.json({ message: "즐겨찾기 추가됨" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "즐겨찾기 추가 실패" }, { status: 500 });
    }
}

// 즐겨찾기 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { docId, email } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 아이디가 제공되지 않음" }, { status: 400 });
        if (!email) return NextResponse.json({ error: "사용자 이메일이 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 참조 문서의 즐겨찾기 목록에서 사용자 이메일 제거
        const documentData = docSnap.data();
        documentData.shortcutsUsers = documentData.shortcutsUsers.filter((userEmail: string) => userEmail !== email);

        await setDoc(docRef, documentData);

        return NextResponse.json({ message: "즐겨찾기 삭제됨" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "즐겨찾기 삭제 실패" }, { status: 500 });
    }
}