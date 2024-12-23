import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// 문서의 폴더를 이동
export async function PUT(req: NextRequest) {
    try {
        const { folderId, document } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!document) return NextResponse.json({ error: "문서가 제공되지 않음" }, { status: 400 });

        const [prevFolderSnap, targetFolderSnap, docSnap] = await Promise.all([
            getDoc(doc(firestore, 'folders', document.folderId)),
            getDoc(doc(firestore, 'folders', folderId)),
            getDoc(doc(firestore, 'documents', document.id))
        ]);

        if (!targetFolderSnap.exists()) return NextResponse.json({ error: "폴더 정보 존재 X" }, { status: 404 });
        if (!docSnap.exists()) return NextResponse.json({ error: "문서 정보 존재 X" }, { status: 404 });
        if (!prevFolderSnap.exists()) return NextResponse.json({ error: "이전 폴더 정보 존재 X" }, { status: 404 });

        const targetFolderData = targetFolderSnap.data();
        const prevFolderData = prevFolderSnap.data();
        const documentData = docSnap.data();

        // 문서의 이전 폴더에서 ID를 제거하고 새 폴더에 추가
        prevFolderData.documentIds = prevFolderData.documentIds.filter((id: string) => id !== document.id);
        targetFolderData.documentIds.push(document.id);

        // 문서가 속한 폴더명 업데이트
        documentData.folderId = folderId;
        documentData.folderName = targetFolderData.name;

        await Promise.all([
            updateDoc(doc(firestore, 'folders', document.folderId), { documentIds: prevFolderData.documentIds }),
            updateDoc(doc(firestore, 'folders', folderId), { documentIds: targetFolderData.documentIds }),
            updateDoc(doc(firestore, 'documents', document.id), documentData)
        ]);

        return NextResponse.json({ success: "문서 이동 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 이동 실패" }, { status: 500 });
    }
}