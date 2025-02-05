import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../firebase/firestore";
import { doc, getDoc, updateDoc, collection, writeBatch, getDocs, serverTimestamp } from "firebase/firestore";
import { Collaborator } from "@/redux/features/documentSlice";
import convertTimestamp from "@/utils/convertTimestamp";
import createTiptapDocument from "@/utils/tiptap-document/createTiptapDocument";
import checkDocumentSize from "@/utils/checkDocumentSize";
import saveToStorage from "@/utils/saveToStorage";
import getDocumentContent from "@/utils/getDocumentContent";

// Firestore의 문서 크기 제한은 1MB
// 안전 마진을 위해 900KB로 설정
export const MAX_FIRESTORE_SIZE = 900000;

// 사용자의 문서를 추가 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folderId, document, autoCreate } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!document) return NextResponse.json({ error: "문서 정보가 제공되지 않음" }, { status: 400 });

        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });

        const folderData = folderDocSnap.data();
        const batch = writeBatch(firestore);

        const newDocRef = doc(firestore, 'documents', document.id);

        // 문서 생성 시에는 빈 문서이므로 Firestore에 즉시 저장
        const newDocument = {
            ...document,
            docContent: document.docContent,
            savePath: 'firestore',
            createdAt: serverTimestamp(),
            readedAt: serverTimestamp(),
        }

        batch.set(newDocRef, newDocument);

        batch.update(folderDocRef, {
            documentIds: [...(folderData.documentIds || []), document.id],
            readedAt: serverTimestamp()
        });

        if (!autoCreate) {
            await createTiptapDocument(document.id, document.docContent);
        }

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

        // 모든 문서 가져오기
        const documentsSnapshot = await getDocs(collection(firestore, 'documents'));

        // 사용자의 문서만 필터링
        const userDocuments = documentsSnapshot.docs.filter(doc => {
            const data = doc.data();
            const isAuthor = data.author.email === email;
            const isCollaborator = data.collaborators.length > 0 &&
                data.collaborators.some((collaborator: Collaborator) => collaborator.email === email);
            return isAuthor || isCollaborator;
        });

        const documents = await Promise.all(userDocuments.map(async doc => {
            const data = doc.data();

            try {
                const docContent = await getDocumentContent(doc.id, data);
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
                    savePath: data.savePath,
                };
            } catch (error) {
                return null;
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
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        let updateData: any = {
            readedAt: serverTimestamp(),
            ...(newDocName !== undefined && { title: newDocName })
        };

        if (newDocContent !== undefined) {
            // 문서 크기 체크
            const contentSize = checkDocumentSize(newDocContent);

            // 문서 크기가 900KB를 초과하면 Storage에 저장
            if (contentSize > MAX_FIRESTORE_SIZE) {
                // Storage로 이동
                const contentUrl = await saveToStorage(docId, newDocContent);
                updateData = {
                    ...updateData,
                    // 스토리지에 문서 내용이 저장되므로 내용을 삭제하고 경로 저장
                    docContent: null,
                    contentUrl: contentUrl,
                    savePath: 'firebase-storage'
                };
            }
            else {
                // Firestore에 직접 저장
                updateData = {
                    ...updateData,
                    // 문서 내용을 직접 저장
                    docContent: newDocContent,
                    contentUrl: null,
                    savePath: 'firestore'
                };
            }
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

        // 삭제되기 전에 미처 내용이 저장되지 못했을 상황을 대비해서 저장
        if (!docData.docContent) {
            await updateDoc(docRef, {
                docContent: docContent,
            });
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