import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

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

        const response = NextResponse.json({ uid: demoUid }, { status: 200 });

        response.cookies.set({
            name: 'authToken',
            value: token,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            httpOnly: true,
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
            name: 'authToken',
            value: '',
            expires: new Date(0),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: '데모 토큰 삭제 실패' }, { status: 500 });
    }
}