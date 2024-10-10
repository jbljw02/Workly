import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../../../../firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { DocumentProps } from "@/redux/features/documentSlice";

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