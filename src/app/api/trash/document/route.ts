import { Collaborator } from "@/types/document.type";
import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import deleteTiptapDocument from '@/utils/tiptap-document/deleteTiptapDocument';
import axios from "axios";
import getDocumentContent from "@/utils/document/getDocumentContent";
import deleteStorageFile from "@/utils/document/deleteStorageFile";

// 휴지통에 있는 사용자의 문서 복원 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folderId, documentId } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!documentId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        // 휴지통에서 문서 조회
        const trashDocRef = doc(firestore, 'trash-documents', documentId);
        const trashDocSnap = await getDoc(trashDocRef);

        if (!trashDocSnap.exists()) return NextResponse.json({ error: "휴지통에서 문서를 찾을 수 없음" }, { status: 404 });

        // 폴더 조회
        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });

        const folderData = folderDocSnap.data();

        // 배치 작업 시작 - 여러 작업을 하나의 트랜잭션으로 묶어 처리
        // 원자성: 모든 작업이 성공하지 못하면 작업은 실패
        const batch = writeBatch(firestore);

        // documents 컬렉션에 새 문서 추가
        const newDocRef = doc(firestore, 'documents', documentId);
        batch.set(newDocRef, trashDocSnap.data());

        // 폴더에 문서 업데이트(documentIds에 새 문서 ID 추가)
        batch.update(folderDocRef, {
            documentIds: [...(folderData.documentIds || []), documentId]
        });

        // 휴지통에서 문서 삭제
        batch.delete(trashDocRef);

        // 휴지통의 폴더 참조 가져오기
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        const trashFolderSnap = await getDoc(trashFolderRef);

        const trashFolderData = trashFolderSnap.data();

        // 삭제할 문서가 참조하고 있는 폴더가 휴지통에 있을 수도, 없을 수도 있음
        // 있다면 폴더에서 문서 ID를 제거해줘야 함
        if (trashFolderSnap && trashFolderData) {
            const updatedDocumentIds = trashFolderData.documentIds.filter((id: string) => id !== documentId);
            batch.update(trashFolderRef, { documentIds: updatedDocumentIds });
        }

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "문서 복원 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 복원 실패" }, { status: 500 });
    }
}

// 휴지통에 있는 사용자의 문서 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        // 휴지통의 모든 문서 가져오기
        const trashDocumentsSnapshot = await getDocs(collection(firestore, 'trash-documents'));

        // 사용자의 문서만 필터링
        const userDocuments = trashDocumentsSnapshot.docs.filter(doc => {
            const data = doc.data();
            const isAuthor = data.author.email === email;
            const isCollaborator = data.collaborators.length > 0 &&
                data.collaborators.some((collaborator: Collaborator) => collaborator.email === email);
            return isAuthor || isCollaborator;
        });

        // 휴지통의 모든 문서를 추출
        const trashDocuments = await Promise.all(userDocuments.map(async doc => {
            const data = doc.data();

            try {
                const docContent = await getDocumentContent(doc.id, data);
                return {
                    id: doc.id,
                    title: data.title,
                    docContent: docContent,
                    createdAt: data.createdAt,
                    readedAt: data.readedAt,
                    author: data.author,
                    folderId: data.folderId,
                    folderName: data.folderName,
                    collaborators: data.collaborators || [],
                    shortcutsUsers: data.shortcutsUsers || [],
                    isPublished: data.isPublished,
                    publishedUser: data.publishedUser,
                    publishedDate: data.publishedDate,
                    savePath: data.savePath,
                };
            } catch (error) {
                return null;
            }
        }));

        // null 값(조회 실패한 문서) 필터링
        const validDocuments = trashDocuments.filter(doc => doc !== null);

        return NextResponse.json(validDocuments, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "문서 정보 요청 실패" }, { status: 500 });
    }
}

// 휴지통에 있는 사용자의 문서 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const docId = searchParams.get('docId');
        const folderId = searchParams.get('folderId');

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });

        // Tiptap Cloud에서 문서 삭제
        try {
            await deleteTiptapDocument(docId);
        } catch (error) {
            // 404 에러는 무시(이미 삭제된 경우)
            if (!axios.isAxiosError(error) || error.response?.status !== 404) {
                throw error;
            }
        }

        // 스토리지에 존재하는 문서 관련 파일을 모두 삭제
        await deleteStorageFile(docId);

        const trashDocRef = doc(firestore, 'trash-documents', docId);
        const trashDocSnap = await getDoc(trashDocRef);
        if (!trashDocSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 휴지통의 폴더 참조 가져오기
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        const trashFolderSnap = await getDoc(trashFolderRef);
        const trashFolderData = trashFolderSnap.data();

        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // 삭제할 문서가 참조하고 있는 폴더가 휴지통에 있을 수도, 없을 수도 있음
        if (trashFolderSnap && trashFolderData) {
            const updatedDocumentIds = trashFolderData.documentIds.filter((id: string) => id !== docId);
            batch.update(trashFolderRef, { documentIds: updatedDocumentIds });
        }

        // 휴지통의 문서 삭제
        batch.delete(trashDocRef);

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "문서와 관련 파일 삭제 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 삭제 실패" }, { status: 500 });
    }
}