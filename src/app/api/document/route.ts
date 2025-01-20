import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../firebase/firestore";
import { doc, getDoc, updateDoc, collection, addDoc, writeBatch, query, where, getDocs, orderBy, serverTimestamp, setDoc } from "firebase/firestore";
import { Collaborator } from "@/redux/features/documentSlice";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import convertTimestamp from "@/utils/convertTimestamp";
import createTiptapDocument from "@/utils/tiptap-document/createTiptapDocument";
import getTiptapDocument from "@/utils/tiptap-document/getTiptapDocument";

// 사용자의 문서를 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folderId, document, autoCreate } = await req.json();

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

        // 스토리지에 문서 내용 생성
        const storage = getStorage();
        const contentRef = ref(storage, `documents/${document.id}/drafts/content.json`);
        const emptyContent = JSON.stringify(document.docContent); // 빈 문서 내용
        await uploadString(contentRef, emptyContent);
        const contentUrl = await getDownloadURL(contentRef);

        // documents 컬렉션에 새 문서 추가
        const newDocRef = doc(firestore, 'documents', document.id);
        const newDocument = {
            ...document,
            contentUrl: contentUrl, // 문서 내용에 대한 참조
            createdAt: serverTimestamp(),
            readedAt: serverTimestamp(),
        };
        batch.set(newDocRef, newDocument);

        // 폴더에 문서 업데이트(documentIds에 새 문서 ID 추가)
        batch.update(folderDocRef, {
            documentIds: [...(folderData.documentIds || []), document.id],
            readedAt: serverTimestamp() // 폴더의 readedAt도 업데이트
        });

        // 즉시 페이지로 라우팅하지 않는 경우 클라우드에 문서 추가 요청 전송
        if (!autoCreate) {
            await createTiptapDocument(document.id, document.docContent);
        }

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

        // 각 문서의 메타데이터 조회
        const documentsSnapshot = await getDocs(collection(firestore, 'documents'));

        // 사용자의 문서만 필터링
        const userDocuments = documentsSnapshot.docs.filter(doc => {
            const data = doc.data();
            const isAuthor = data.author.email === email;
            const isCollaborator = data.collaborators.length > 0 &&
                data.collaborators.some((collaborator: Collaborator) => collaborator.email === email);
            return isAuthor || isCollaborator;
        });

        // 문서 내용 조회 함수
        const getDocumentContent = async (docId: string, contentUrl: string) => {
            // 1차: Tiptap Cloud에서 조회 시도
            try {
                const docContent = await getTiptapDocument(docId);
                return docContent;
            } catch (error) {
                // 2차: 실패 시 Storage에서 조회
                try {
                    const response = await fetch(contentUrl);
                    if (!response.ok) throw new Error('Storage 조회 실패');
                    return await response.json();
                } catch (storageError) {
                    throw new Error('문서 내용 조회 실패');
                }
            }
        };

        // 필터링된 문서들의 내용 조회
        const documents = await Promise.all(userDocuments.map(async doc => {
            const data = doc.data();

            try {
                const docContent = await getDocumentContent(doc.id, data.contentUrl);

                return {
                    id: doc.id,
                    title: data.title,
                    docContent: docContent,
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
            } catch (error) {
                return null; // 개별 문서 조회 실패 시에도 전체 요청은 계속 진행
            }
        }));

        // null 값(조회 실패한 문서) 필터링
        const validDocuments = documents.filter(doc => doc !== null);

        return NextResponse.json(validDocuments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 정보 요청 실패" }, { status: 500 });
    }
}

// 문서명, 내용 수정 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { docId, newDocName, newDocContent } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 아이디가 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);

        const updateData = {
            readedAt: serverTimestamp(),
            ...(newDocName !== undefined && { title: newDocName })
        };

        // 문서 내용 변경을 요청할 경우에만 스토리지 업데이트
        if (newDocContent !== undefined) {
            const storage = getStorage();
            const contentRef = ref(storage, `documents/${docId}/drafts/content.json`);
            await uploadString(contentRef, JSON.stringify(newDocContent));
        }

        await updateDoc(docRef, updateData);

        return NextResponse.json({ success: "문서 수정 성공" }, { status: 200 });
    } catch (error) {
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

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        await updateDoc(docRef, {
            readedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: "열람 시간 업데이트 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "열람 시간 업데이트 실패" }, { status: 500 });
    }
}

// 문서 삭제 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { email, folderId, docId, docContent } = await req.json();

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        const docData = docSnap.data();

        // 폴더 참조 가져오기
        const folderRef = doc(firestore, 'folders', folderId);
        const folderSnap = await getDoc(folderRef);
        if (!folderSnap.exists()) return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });

        const folderData = folderSnap.data();

        // 스토리지 문서 내용 가져오기
        const storage = getStorage();
        const contentRef = ref(storage, `documents/${docId}/drafts/content.json`);
        const response = await fetch(docData.contentUrl);
        const content = await response.json();

        // 삭제되기 전에, 미처 내용이 저장되지 못했을 상황을 대비해서 저장
        if (!content) {
            await uploadString(contentRef, JSON.stringify(docContent));
        }

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