import { NextRequest, NextResponse } from "next/server";
import cookie from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ success: "로그아웃 및 토큰 삭제 성공" }, { status: 200 });

        response.headers.set(
            'Set-Cookie',
            cookie.serialize('authToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                expires: new Date(0), // 쿠키 만료 시간 설정
                sameSite: 'strict',
                path: '/',
            })
        );

        return response;
    } catch (error) {
        return NextResponse.json({ error: "로그아웃 및 토큰 삭제 실패" }, { status: 500 });
    }
}