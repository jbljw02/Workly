import { NextRequest, NextResponse } from "next/server";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { Folder } from "@/redux/features/folderSlice";
import firestore from "../../../../firebase/firestore";

// 사용자의 DB에 폴더를 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { email, folder } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        await updateDoc(userDocRef, {
            folders: arrayUnion(folder)
        });

        return NextResponse.json({ success: "폴더 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 정보 추가 실패" }, { status: 500 });
    }
}

// 사용자의 폴더를 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        }

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const folders = userData?.folders || [];

        return NextResponse.json(folders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 정보 요청 실패" }, { status: 500 });
    }
}

// 폴더명 수정 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { email, folderID, newFolderName } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderID) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const folders = userData.folders || [];

        const updatedFolders = folders.map((folder: Folder) => {
            if (folder.id === folderID) {
                return {
                    ...folder,
                    name: newFolderName,
                }
            }
            return folder;
        });

        await updateDoc(userDocRef, { folders: updatedFolders });

        return NextResponse.json({ success: "폴더 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더명 수정 실패" }, { status: 500 });
    }
}

// 폴더 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        
        const email = searchParams.get('email');
        const folderID = searchParams.get('folderID')

        console.log(email, folderID);

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderID) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });

        const userDocRef = doc(firestore, 'users', email);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return NextResponse.json({ error: "사용자 정보 존재 X" }, { status: 404 });
        }

        const userData = userDocSnap.data();
        const folders = userData.folders || [];

        // 삭제할 폴더를 제외한 나머지 폴더로 목록을 재생성
        const updatedFolders = folders.filter((folder: Folder) => folder.id !== folderID);

        await updateDoc(userDocRef, { folders: updatedFolders });

        return NextResponse.json({ success: "폴더 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더명 삭제 실패" }, { status: 500 });
    }
}