import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../../../firebase/firebaseAdmin';

// POST 요청을 받아 토큰을 검증하고, 쿠키에 저장
export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        // 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) {
            throw new Error('토큰 검증 실패');
        }

        const response = NextResponse.json({ success: "토큰 인증 성공 및 JWT 쿠키 설정 완료" });
        return response;
    } catch (error) {
        return NextResponse.json({ error: "토큰 검증 실패" }, { status: 500 });
    }
}