import { NextRequest, NextResponse } from "next/server";
import admin from "@/firebase/firebaseAdmin";

// 토큰을 통해 사용자의 uid를 가져옴
const getUserId = async (req: NextRequest) => {
    const authToken = req.cookies.get('authToken')?.value;
    if (!authToken) return NextResponse.json({ error: "인증되지 않은 요청" }, { status: 401 });

    try {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        return decodedToken.uid;
    } catch (error) {
        return NextResponse.json({ error: "토큰 검증 실패" }, { status: 401 });
    }
}

export default getUserId;