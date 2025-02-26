import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../../firebase/firebaseAdmin';
import { verify } from 'jsonwebtoken';
import { JWTToken } from '@/types/user.type';

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

// POST 요청을 받아 토큰을 검증하고, 쿠키에 저장
export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        // Firebase 토큰 검증 시도
        try {
            const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
            if (!decodedFirebaseToken) {
                throw new Error('Firebase 토큰 검증 실패');
            }
            return NextResponse.json({ success: "Firebase 토큰 검증 성공" });
        } catch (firebaseError) {
            // Firebase 검증 실패시 JWT(데모 토큰) 검증 시도
            try {
                const decoded = verify(token, SECRET_KEY);

                // 데모 토큰인 경우
                if ((decoded as JWTToken).isDemo) {
                    return NextResponse.json({
                        success: "데모 토큰 검증 성공",
                        isDemo: true
                    });
                }
                throw new Error('유효하지 않은 토큰');
            } catch (jwtError) {
                throw new Error('토큰 검증 실패');
            }
        }
    } catch (error) {
        return NextResponse.json({ error: "토큰 검증 실패" }, { status: 401 });
    }
}