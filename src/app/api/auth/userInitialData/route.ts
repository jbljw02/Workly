import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../firebase/firestore";
import { doc, getDoc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
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

        // 파이어베이스 스토리지에서 아바타 이미지 가져오기
        const storage = getStorage();
        const avatarRef = ref(storage, 'images/avatar.png');
        const avatarURL = await getDownloadURL(avatarRef);

        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // 사용자 문서 생성
        batch.set(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL ? user.photoURL : avatarURL,
        });

        const initialFolderId = uuidv4();

        // 초기 폴더 생성
        const folderDocRef = doc(firestore, 'folders', initialFolderId);
        batch.set(folderDocRef, {
            id: initialFolderId,
            name: '내 폴더',
            documentIds: [],
            author: {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL ? user.photoURL : avatarURL,
            },
            collaborators: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "회원가입 후 폴더 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "회원가입 후 폴더 추가 실패" }, { status: 500 });
    }
}
