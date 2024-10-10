import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../../../../firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { DocumentProps } from "@/redux/features/documentSlice";

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
        const newCollaborators = [...coworkers, ...collaborators];

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
        console.log("userData: ", userData);
        const targetDoc: DocumentProps = userData.documents.find((doc: DocumentProps) => doc.id === docId);
        const collaborators = targetDoc?.collaborators || [];
        return NextResponse.json(collaborators, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서의 협업자 정보 요청 실패" }, { status: 500 });
    }
}