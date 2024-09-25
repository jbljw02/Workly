import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import admin from '../../../../../firebase/firebaseAdmin';

// 이메일로 로그인시 생성된 토큰을 검증
export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        const decodedToken = await admin.auth().verifyIdToken(token);

        // 쿠키 설정
        const authCookie = cookie.serialize('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // 개발 환경이 아닐 때에만 secure 적용
            sameSite: 'strict', // CSRF 공격 방지
            path: '/',
        });

        const response = NextResponse.json({ success: "토큰 인증 성공 및 JWT 쿠키 설정 완료" }, { status: 200 });
        response.headers.set('Set-Cookie', authCookie);

        return response;
    } catch (error) {
        return NextResponse.json({ error: "토큰 검증 실패" }, { status: 500 });
    }
}