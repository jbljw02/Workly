import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../firebase/firestore";
import { doc, getDoc, updateDoc, collection, addDoc, writeBatch, query, where, getDocs, orderBy, serverTimestamp, setDoc } from "firebase/firestore";
import { Folder } from "@/redux/features/folderSlice";
import { Collaborator, DocumentProps } from "@/redux/features/documentSlice";
import { Timestamp } from 'firebase/firestore';

// 사용자의 문서를 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folderId, document } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!document) return NextResponse.json({ error: "문서 정보가 제공되지 않음" }, { status: 400 });

        // 폴더 참조 가져오기
        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });

        const folderData = folderDocSnap.data();

        // 배치 작업 시작 - 여러 작업을 하나의 트랜잭션으로 묶어 처리
        // 원자성: 모든 작업이 성공하지 못하면 작업은 실패
        const batch = writeBatch(firestore);

        // documents 컬렉션에 새 문서 추가
        const newDocRef = doc(firestore, 'documents', document.id);
        const newDocument = {
            ...document,
            createdAt: serverTimestamp(),
            readedAt: serverTimestamp(),
        };
        batch.set(newDocRef, newDocument);

        // 폴더에 문서 업데이트(documentIds에 새 문서 ID 추가)
        const updatedDocumentIds = [...(folderData.documentIds || []), document.id];
        batch.update(folderDocRef, {
            documentIds: updatedDocumentIds,
            readedAt: serverTimestamp() // 폴더의 readedAt도 업데이트
        });

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "문서 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 추가 실패" }, { status: 500 });
    }
}

// 사용자의 문서를 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        // documents 컬렉션에서 모든 문서 가져오기
        const documentsCollection = collection(firestore, 'documents');
        const documentsSnapshot = await getDocs(documentsCollection);

        // 모든 문서를 추출
        const documents = documentsSnapshot.docs.map(doc => {
            const data = doc.data();

            // 타임스탬프 변환
            const convertTimestamp = (timestamp: Timestamp) => ({
                seconds: timestamp.seconds,
                nanoseconds: timestamp.nanoseconds,
            });

            // 타입 변환
            const document: DocumentProps = {
                id: doc.id,
                title: data.title,
                docContent: data.docContent || null,
                createdAt: convertTimestamp(data.createdAt),
                readedAt: convertTimestamp(data.readedAt),
                author: data.author,
                folderId: data.folderId,
                folderName: data.folderName,
                collaborators: data.collaborators || [],
                shortcutsUsers: data.shortcutsUsers || [],
                isPublished: data.isPublished,
                publishedUser: data.publishedUser,
                publishedDate: data.publishedDate ? convertTimestamp(data.publishedDate) : undefined,
            };

            return document;
        });

        // 변환된 문서 데이터를 필터링
        const filteredDocuments = documents.filter(doc => {
            // 현재 사용자가 작성자인지 확인
            const isAuthor = doc.author.email === email;

            // 현재 사용자가 협업자인지 확인
            const isCollaborator = doc.collaborators.length > 0 &&
                doc.collaborators.some((collaborator: Collaborator) => collaborator.email === email);

            // 작성자이거나 협업자인 경우 해당 문서 반환
            return isAuthor || isCollaborator;
        });

        return NextResponse.json(filteredDocuments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 정보 요청 실패" }, { status: 500 });
    }
}

// 문서명 수정 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { docId, newDocName, newDocContent } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 아이디가 제공되지 않음" }, { status: 400 });

        // 문서 참조 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });
        }

        // 문서명, 문서 내용, 수정 시간 업데이트
        const updateData = {
            readedAt: serverTimestamp(),
            ...(newDocName !== undefined && { title: newDocName }),
            ...(newDocContent !== undefined && { docContent: newDocContent }),
        };

        await updateDoc(docRef, updateData);

        return NextResponse.json({ success: "문서 수정 성공" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "문서 수정 실패" }, { status: 500 });
    }
}

// 문서 초기 접속 시 열람일 업데이트 - UPDATE
export async function PATCH(req: NextRequest) {
    try {
        const { docId } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 아이디가 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });
        }

        await updateDoc(docRef, {
            readedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: "열람 시간 업데이트 성공" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "열람 시간 업데이트 실패" }, { status: 500 });
    }
}

// 문서 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const email = searchParams.get('email');
        const folderId = searchParams.get('folderId');
        const docId = searchParams.get('docId');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });
        }

        const docData = docSnap.data();

        // 폴더 참조 가져오기
        const folderRef = doc(firestore, 'folders', folderId);
        const folderSnap = await getDoc(folderRef);

        if (!folderSnap.exists()) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }

        const folderData = folderSnap.data();

        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // 문서를 trash 컬렉션으로 이동
        const trashDocRef = doc(firestore, 'trash-documents', docId);
        batch.set(trashDocRef, {
            ...docData,
        });

        // 원본 문서 삭제
        batch.delete(docRef);

        // 폴더에서 문서 ID 제거
        const updatedDocumentIds = folderData.documentIds.filter((id: string) => id !== docId);
        batch.update(folderRef, { documentIds: updatedDocumentIds });

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "문서를 휴지통으로 이동" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 삭제 실패" }, { status: 500 });
    }
}