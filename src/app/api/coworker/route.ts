import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../firebase/firestore";
import { UserProps } from "@/redux/features/userSlice";

// 협업자 가져오기 - READ
export async function GET(req: NextRequest) {
    try {
        const email = req.nextUrl.searchParams.get('email');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const coworkers: UserProps[] = userDocSnap.data().coworkers;

        return NextResponse.json(coworkers, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "협업자 가져오기 실패" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {

}