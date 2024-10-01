import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Folder } from "@/redux/features/folderSlice";
import { DocumentProps } from "@/redux/features/documentSlice";

export async function PUT(req: NextRequest) {
    try {
        const { email, folderId, document } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!document) return NextResponse.json({ error: "문서가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const folders: Folder[] = userData.folders || [];
        const documents: DocumentProps[] = userData.documents || [];

        // 문서의 이전 폴더에서 ID를 제거
        const prevFolder = folders.find(folder => folder.name === document.folderName);
        if (prevFolder) {
            prevFolder.documentIds = prevFolder.documentIds.filter(id => id !== document.id);
        }

        // 새 폴더를 찾아서 문서 ID 추가
        const targetFolder = folders.find(folder => folder.id === folderId);
        if (!targetFolder) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }
        targetFolder.documentIds.push(document.id);

        // 문서가 속한 폴더명 업데이트
        const documentIndex = documents.findIndex(doc => doc.id === document.id);
        if (documentIndex !== -1) {
            documents[documentIndex] = {
                ...documents[documentIndex],
                folderName: targetFolder.name,
            };
        }

        await updateDoc(userDocRef, {
            folders: folders,
            documents: documents,
        });

        return NextResponse.json({ success: "문서 이동 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 이동 실패" }, { status: 500 });
    }
}