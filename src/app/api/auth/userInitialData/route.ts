import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../firebase/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function POST(req: NextRequest) {
    try {
        const { user } = await req.json();

        const userDocRef = doc(firestore, 'users', user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return NextResponse.json({ success: "회원이 이미 존재" }, { status: 200 });
        }

        const initialFolder = {
            id: uuidv4(),
            name: '내 폴더',
            documentIds: [],
            author: user.email,
            sharedWith: [],
        }

        // 파이어베이스 스토리지에서 아바타 이미지 가져오기
        const storage = getStorage();
        const avatarRef = ref(storage, 'images/avatar.png');
        const avatarURL = await getDownloadURL(avatarRef);

        await setDoc(doc(firestore, 'users', user.email), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL ? user.photoURL : avatarURL,
            folders: [initialFolder],
            documents: [],
        });

        return NextResponse.json({ success: "회원가입 후 폴더 추가 성공" }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: "회원가입 후 폴더 추가 실패" }, { status: 500 });
    }
}