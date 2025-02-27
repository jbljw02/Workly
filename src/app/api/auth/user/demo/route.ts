import { NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

// GET - 데모 사용자 체크
export async function GET() {
    try {
        const cookieStore = cookies();
        const demoToken = cookieStore.get('demoToken');

        if (!demoToken?.value) {
            return NextResponse.json({
                uid: null,
                email: null,
                displayName: null,
                isDemo: false
            }, { status: 200 });
        }

        // 토큰 유효성 검증 및 디코딩
        const decoded = verify(demoToken.value, SECRET_KEY) as {
            uid: string;
            email: string;
            displayName: string;
            isDemo: boolean;
        };

        return NextResponse.json({
            uid: decoded.uid,
            email: decoded.email,
            displayName: decoded.displayName,
            isDemo: decoded.isDemo
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            uid: null,
            email: null,
            displayName: null,
            isDemo: false
        }, { status: 200 });
    }
}

// CREATE - 데모 사용자 토큰 생성
export async function POST() {
    try {
        const demoUid = uuidv4();

        // JWT 토큰 생성(데모 사용자임을 명시)
        const token = sign(
            {
                uid: demoUid,
                email: 'guest@workly.kr',
                displayName: '게스트',
                isDemo: true,
                exp: Math.floor(Date.now() / 1000) + (30 * 60), // 30분
            },
            SECRET_KEY
        );

        const response = NextResponse.json({
            uid: demoUid,
            email: 'guest@workly.kr',
            displayName: '게스트',
            isDemo: true,
        }, { status: 200 });

        response.cookies.set({
            name: 'demoToken',
            value: token,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 1800, // 30분
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: '데모 토큰 생성 실패' }, { status: 500 });
    }
}

// DELETE - 데모 사용자 토큰 삭제
export async function DELETE() {
    try {
        const response = NextResponse.json({ success: true }, { status: 200 });

        // 쿠키 즉시 만료 처리
        response.cookies.set({
            name: 'demoToken',
            value: '',
            expires: new Date(0),
            path: '/',
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: '데모 토큰 삭제 실패' }, { status: 500 });
    }
}