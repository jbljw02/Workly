import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Folder } from "@/redux/features/folderSlice";

export async function POST(req: NextRequest) {
    try {
        const { email, folderId, document } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const folders = userData.folders || [];

        // 문서를 추가할 폴더의 인덱스를 찾고 문서를 추가함
        const targetFolderIndex = folders.findIndex((folder: Folder) => folder.id === folderId);
        if (targetFolderIndex === -1) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }
        folders[targetFolderIndex].documents.push(document);

        await updateDoc(userDocRef, {
            folders: folders
        })

        // 문서 배열에 파라미터로 받은 문서를 추가
        const documents = userData.documents || [];
        documents.push(document);

        await updateDoc(userDocRef, {
            documents: documents,
        })

        return NextResponse.json({ success: "문서 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 추가 실패" }, { status: 500 });
    }
}