import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const authToken = req.cookies.get('authToken')?.value;
    const demoToken = req.cookies.get('demoToken')?.value;
    const { pathname } = req.nextUrl;

    // 데모 토큰이 있는 경우
    if (demoToken) {
        try {
            const verifyUrl = `${req.nextUrl.origin}/api/auth/verify-token`;
            const verifyResponse = await fetch(verifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: demoToken }),
            });

            if (!verifyResponse.ok) {
                // 데모 토큰 검증 실패시 홈으로 리다이렉션
                return NextResponse.redirect(new URL('/', req.url));
            }

            const data = await verifyResponse.json();

            // 데모 사용자는 /editor/* 경로만 접근 가능
            if (data.isDemo) {
                if (pathname.startsWith('/demo')) {
                    return NextResponse.next();
                } else {
                    return NextResponse.redirect(new URL('/demo/home', req.url));
                }
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // 일반 인증 토큰이 있는 경우
    if (authToken) {
        try {
            const verifyUrl = `${req.nextUrl.origin}/api/auth/verify-token`;
            const verifyResponse = await fetch(verifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: authToken }),
            });

            if (!verifyResponse.ok) {
                if (pathname.startsWith('/editor')) {
                    return NextResponse.redirect(new URL('/', req.url));
                }
                return NextResponse.next();
            }

            // 인증된 사용자가 로그인/회원가입 페이지 접근시 /editor/home으로 리다이렉션
            if (['/', '/login', '/signup'].includes(pathname)) {
                return NextResponse.redirect(new URL('/editor/home', req.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // 토큰이 없는 경우
    if (!authToken && !demoToken) {
        if (pathname.startsWith('/editor') || pathname.startsWith('/demo')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

// 미들웨어 적용 경로 설정
export const config = {
    matcher: ['/', '/login', '/signup', '/editor/:path*', '/demo/:path*'], // /editor/* 경로에도 적용
};