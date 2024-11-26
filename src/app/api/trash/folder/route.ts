import { collection, getDocs, query, where, orderBy, getDoc, doc, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

// 휴지통에 있는 폴더 복원 - POST
export async function POST(req: NextRequest) {
    try {
        const { folderId } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });

        // 휴지통의 폴더 참조 가져오기
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        const trashFolderSnap = await getDoc(trashFolderRef);

        if (!trashFolderSnap.exists()) {
            return NextResponse.json({ error: "휴지통에서 폴더를 찾을 수 없음" }, { status: 404 });
        }

        const trashFolderData = trashFolderSnap.data();
        
        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // folders 컬렉션에 폴더를 복원 시킴
        const newFolderRef = doc(firestore, 'folders', folderId);
        batch.set(newFolderRef, {
            ...trashFolderData,
        });

        // 폴더 내의 모든 문서도 복원
        const documentIds = trashFolderData.documentIds || [];
        for (const docId of documentIds) {
            const trashDocRef = doc(firestore, 'trash-documents', docId);
            const trashDocSnap = await getDoc(trashDocRef);

            if (trashDocSnap.exists()) {
                const docData = trashDocSnap.data();
                // documents 컬렉션에 문서 복원
                const newDocRef = doc(firestore, 'documents', docId);
                batch.set(newDocRef, docData);
                // 휴지통에서 문서 삭제
                batch.delete(trashDocRef);
            }
        }

        // 휴지통에서 폴더 삭제
        batch.delete(trashFolderRef);

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "폴더 및 관련 문서 복원 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 복원 실패" }, { status: 500 });
    }
}

// 휴지통에 있는 사용자의 폴더 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        const trashFoldersCollection = collection(firestore, 'trash-folders');

        // email과 폴더의 author가 같은 폴더들을 쿼리
        const trashFolderQuery = query(trashFoldersCollection,
            where("author.email", "==", email),
            orderBy("createdAt", "asc"));

        // 쿼리문을 이용해 폴더 정보 가져오기
        const querySnapshot = await getDocs(trashFolderQuery);

        const trashFolders = querySnapshot.docs.map(doc => doc.data());

        return NextResponse.json(trashFolders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "폴더 정보 요청 실패" }, { status: 500 });
    }
}

// 휴지통에 있는 폴더 영구 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const email = searchParams.get('email');
        const folderId = searchParams.get('folderId');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 아이디가 제공되지 않음" }, { status: 400 });

        const trashFolderDocRef = doc(firestore, 'trash-folders', folderId);
        const trashFolderDocSnap = await getDoc(trashFolderDocRef);

        if (!trashFolderDocSnap.exists()) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }

        const trashFolderData = trashFolderDocSnap.data();

        // 배치 작업 시작
        const batch = writeBatch(firestore);
        const storage = getStorage();

        // 폴더를 trash-folders 컬렉션으로 이동
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        batch.set(trashFolderRef, {
            ...trashFolderData,
        });

        // 원본 폴더 삭제
        batch.delete(trashFolderDocRef);

        // 폴더 내 문서들도 모두 삭제
        const documentIds = trashFolderData.documentIds || [];
        for (const docId of documentIds) {
            const docRef = doc(firestore, 'trash-documents', docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Storage에서 문서 내용 삭제
                const contentRef = ref(storage, `documents/${docId}/content.json`);
                try {
                    await deleteObject(contentRef);
                } catch (error) {
                    console.warn(`스토리지 파일 삭제 실패(문서 ID: ${docId}):`, error);
                }

                // Firestore에서 문서 삭제
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