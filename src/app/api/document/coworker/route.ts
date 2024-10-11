import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../../../../firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { DocumentProps } from "@/redux/features/documentSlice";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

// 문서에 협업자 추가하기 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { email, docId, collaborators } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!collaborators) return NextResponse.json({ error: "협업자가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const targetDoc: DocumentProps = userData.documents.find((doc: DocumentProps) => doc.id === docId);
        const coworkers = targetDoc?.collaborators || [];

        // 파이어베이스 스토리지에서 아바타 이미지 가져오기
        const storage = getStorage();
        const avatarRef = ref(storage, 'images/avatar.png');
        const avatarURL = await getDownloadURL(avatarRef);

        // photoURL을 아바타 이미지로 변경
        const newCollaborators = [...coworkers, ...collaborators].map(collaborator => ({
            ...collaborator,
            photoURL: collaborator.photoURL === 'unknown-user' ? avatarURL : collaborator.photoURL
        }));

        // 문서의 다른 내용은 유지, 협업자만 업데이트
        const updatedDoc = {
            ...targetDoc,
            collaborators: newCollaborators,
        };

        // ID가 일치하는 문서, 즉 선택된 문서에만 업데이트된 값 적용
        const updatedDocs = userData.documents.map((doc: DocumentProps) =>
            doc.id === docId ? updatedDoc : doc
        );

        await updateDoc(userDocRef, {
            documents: updatedDocs,
        });

        return NextResponse.json({ success: "문서에 협업자 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서에 협업자 추가하기 실패" }, { status: 500 });
    }
}

// 문서의 협업자 가져오기 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');
        const docId = searchParams.get('docId');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const targetDoc: DocumentProps = userData.documents.find((doc: DocumentProps) => doc.id === docId);
        const collaborators = targetDoc?.collaborators || [];

        return NextResponse.json(collaborators, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서의 협업자 정보 요청 실패" }, { status: 500 });
    }
}

// 협업자 권한 변경하기 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { authorEmail, targetEmail, docId, newAuthority } = await req.json();

        if (!authorEmail) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!targetEmail) return NextResponse.json({ error: "협업자 이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!newAuthority) return NextResponse.json({ error: "권한이 제공되지 않음" }, { status: 400 });

        // 문서의 관리자의 이메일을 통해 정보 가져오기
        const userDocRef = doc(firestore, 'users', authorEmail);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const targetDoc: DocumentProps = userData.documents.find((doc: DocumentProps) => doc.id === docId);
        const collaborators = targetDoc?.collaborators || [];

        // 변경할 협업자의 이메일을 찾아 권한 업데이트
        const updatedCollaborators = collaborators.map(collab =>
            collab.email === targetEmail ? { ...collab, authority: newAuthority } : collab
        );

        // 업데이트된 협업자 목록을 문서에 적용
        targetDoc.collaborators = updatedCollaborators;

        // 문서 전체에 변경사항 적용
        const updatedDocuments: DocumentProps[] = userData.documents.map((doc: DocumentProps) =>
            doc.id === docId ? targetDoc : doc
        );

        await updateDoc(userDocRef, {
            documents: updatedDocuments
        });

        return NextResponse.json({ success: "협업자 권한 변경 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "협업자 권한 변경 실패" }, { status: 500 });
    }
}