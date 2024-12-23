import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, orderBy, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import firestore from "../../../firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";

// 사용자의 DB에 폴더를 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folder } = await req.json();

        if (!folder) return NextResponse.json({ error: "폴더 정보가 제공되지 않음" }, { status: 400 });

        // folders 컬렉션에 새로운 문서 참조 생성
        const newFolderRef = doc(firestore, 'folders', folder.id);

        const newFolder = {
            ...folder,
            createdAt: serverTimestamp(),
            readedAt: serverTimestamp()
        };

        // 문서 저장
        await setDoc(newFolderRef, newFolder);

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

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        const foldersCollection = collection(firestore, 'folders');

        // email과 폴더의 author가 같은 폴더들을 쿼리
        const folderQuery = query(foldersCollection,
            where("author.email", "==", email),
            orderBy("createdAt", "asc"));

        // 쿼리문을 이용해 폴더 정보 가져오기
        const querySnapshot = await getDocs(folderQuery);

        const folders = querySnapshot.docs.map(doc => doc.data());

        return NextResponse.json(folders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 정보 요청 실패" }, { status: 500 });
    }
}

// 폴더명 수정 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { folderId, newFolderName } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });
        if (!newFolderName) return NextResponse.json({ error: "폴더명이 제공되지 않음" }, { status: 400 });

        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) return NextResponse.json({ error: "폴더가 존재하지 않습니다" }, { status: 404 });

        await updateDoc(folderDocRef, {
            name: newFolderName,
        });

        return NextResponse.json({ success: "폴더 수정 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더명 수정 실패" }, { status: 500 });
    }
}

// 폴더 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const email = searchParams.get('email');
        const folderId = searchParams.get('folderId');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });

        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }

        const folderData = folderDocSnap.data();

        // 폴더 관리자만 삭제 가능
        if (folderData.author.email !== email) {
            return NextResponse.json({ error: "폴더 삭제 권한이 없습니다" }, { status: 403 });
        }

        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // 폴더를 trash-folders 컬렉션으로 이동
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        batch.set(trashFolderRef, {
            ...folderData,
        });

        // 원본 폴더 삭제
        batch.delete(folderDocRef);

        // 폴더 내 문서들도 trash-documents 컬렉션으로 이동
        const documentIds = folderData.documentIds || [];
        for (const docId of documentIds) {
            const docRef = doc(firestore, 'documents', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docData = docSnap.data();
                const trashDocRef = doc(firestore, 'trash-documents', docId);
                batch.set(trashDocRef, {
                    ...docData
                });
                batch.delete(docRef);
            }
        }

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "폴더 및 관련 문서를 휴지통으로 이동" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 삭제 실패" }, { status: 500 });
    }
}