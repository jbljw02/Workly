import { NextRequest, NextResponse } from "next/server";
import cookie from 'cookie';

// POST 메서드로 처리
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = body.token;

        // 토큰을 검증하고 JWT 쿠키로 설정
        const cookieHeader = cookie.serialize('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // 개발 환경이 아닐 때만 secure
            maxAge: 3600, // 1시간 동안 유효
            sameSite: 'strict',
            path: '/',
        });

        const response = NextResponse.json({ success: "토큰 인증 성공 및 JWT 쿠키 설정 완료" });
        response.headers.set('Set-Cookie', cookieHeader);

        return response;
    } catch (error) {
        return NextResponse.json({ error: '토큰 인증 실패' }, { status: 401 });
    }
}