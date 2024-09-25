import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { user } = await req.json();

        const userDocRef = doc(firestore, 'users', user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return NextResponse.json({ success: "회원이 이미 존재" }, { status: 200 });
        }
        else {
            const initialFolder = {
                id: uuidv4(),
                name: '내 폴더',
                documentIds: [],
                author: {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
                sharedWith: [],
            }

            await setDoc(doc(firestore, 'users', user.email), {
                email: user.email,
                folders: [initialFolder],
                documents: [],
            });

            return NextResponse.json({ success: "회원가입 후 폴더 추가 성공" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ success: "회원가입 후 폴더 추가 성공" }, { status: 500 });
    }
}