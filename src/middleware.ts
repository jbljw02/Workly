import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;
    const { pathname } = req.nextUrl;

    // 로그인 상태에서 홈, 로그인, 회원가입 페이지 접근 시 리다이렉션
    if (token) {
        try {
            // 라우팅을 통해 JWT 검증 요청
            const verifyResponse = await fetch(new URL('/api/auth/verifyToken', req.url), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            // 검증 실패 시 요청한 페이지 그대로 리다이렉션
            if (!verifyResponse.ok) {
                if (pathname.startsWith('/editor')) {
                    return NextResponse.redirect(new URL('/', req.url));
                }
                else {
                    return NextResponse.next();
                }
            }

            // 검증 성공 시 특정 경로 리다이렉션 처리
            if (['/', '/login', '/signup'].includes(pathname)) {
                return NextResponse.redirect(new URL('/editor/home', req.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    else {
        // 로그인하지 않은 사용자가 /editor로 시작하는 경로로 접근할 때 홈으로 리다이렉션
        if (pathname.startsWith('/editor')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next(); // 경로 접근 허용
}

// 미들웨어 적용 경로 설정
export const config = {
    matcher: ['/', '/login', '/signup', '/editor/:path*'], // /editor/* 경로에도 적용
};