import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Folder } from "@/redux/features/folderSlice";
import { DocumentProps } from "@/redux/features/documentSlice";

// 사용자의 문서를 추가 - CREATE
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

        // 폴더의 documents 배열에 문서 ID 추가
        folders[targetFolderIndex].documentIds.push(document.id);

        // folders 업데이트
        await updateDoc(userDocRef, {
            folders: folders
        })

        // 문서 배열에 파라미터로 받은 문서를 추가
        const documents = userData.documents || [];
        documents.push(document);

        // documents 업데이트
        await updateDoc(userDocRef, {
            documents: documents,
        });

        return NextResponse.json({ success: "문서 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 추가 실패" }, { status: 500 });
    }
}

// 사용자의 문서를 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        }

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const documents = userData.documents || [];

        return NextResponse.json(documents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 정보 요청 실패" }, { status: 500 });
    }
}

// 문서명을 수정 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { email, docId, parentFolderName, newDocName } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });
        if (!newDocName) return NextResponse.json({ error: "폴더명이 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();

        const allDocs: DocumentProps[] = userData.documents || [];

        // 선택된 폴더 내에 있는 문서명만 변경
        const updatedDocs = allDocs.map(doc => {
            if (doc.id === docId) {
                return {
                    ...doc,
                    title: newDocName,
                }
            }
            return doc;
        });

        // documents 업데이트
        await updateDoc(userDocRef, {
            documents: updatedDocs,
        });

        return NextResponse.json({ success: "문서 수정 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더명 수정 실패" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {

}