import { Collaborator } from "@/redux/features/documentSlice";
import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

// 휴지통에 있는 사용자의 문서 복원 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { folderId, documentId } = await req.json();

        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });
        if (!documentId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        // 휴지통에서 문서 조회
        const trashDocRef = doc(firestore, 'trash-documents', documentId);
        const trashDocSnap = await getDoc(trashDocRef);

        if (!trashDocSnap.exists()) {
            return NextResponse.json({ error: "휴지통에서 문서를 찾을 수 없음" }, { status: 404 });
        }

        // 폴더 조회
        const folderDocRef = doc(firestore, 'folders', folderId);
        const folderDocSnap = await getDoc(folderDocRef);

        if (!folderDocSnap.exists()) {
            return NextResponse.json({ error: "폴더를 찾을 수 없음" }, { status: 404 });
        }

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

        // documents 컬렉션에서 모든 문서 가져오기
        const trashDocumentsCollection = collection(firestore, 'trash-documents');
        const trashDocumentsSnapshot = await getDocs(trashDocumentsCollection);

        // 휴지통의 모든 문서를 추출
        const trashDocuments = await Promise.all(trashDocumentsSnapshot.docs.map(async doc => {
            const data = doc.data();

            let docContent = null;
            // 문서 내용이 존재하는 경우에만 스토리지에서 가져오기
            if (data.contentUrl) {
                const response = await fetch(data.contentUrl);
                docContent = await response.json();
            }

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
            };
        }));

        // 변환된 문서 데이터를 필터링
        const filteredDocuments = trashDocuments.filter(doc => {
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
        console.log(error);
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

        const trashDocRef = doc(firestore, 'trash-documents', docId);
        const trashDocSnap = await getDoc(trashDocRef);
        if (!trashDocSnap.exists()) {
            return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });
        }

        const trashData = trashDocSnap.data();

        // 스토리지에 있는 문서 내용 삭제
        const storage = getStorage();
        const contentRef = ref(storage, `documents/${docId}/content.json`);

        // 문서 내용에서 이미지 URL 추출
        const imageUrls: string[] = [];
        const fileUrls: string[] = [];

        // 문서의 내용 배열을 순회하면서 이미지 및 파일의 src 추출
        if (trashData.contentUrl) {
            try {
                // contentUrl을 통해 스토리지에 저장된 문서 내용 가져오기
                const response = await fetch(trashData.contentUrl);
                if (response.ok) {
                    const docContent = await response.json();

                    if (docContent?.content) {
                        docContent.content.forEach((block: any) => {
                            if (block.type === 'imageComponent' && block.attrs.id) {
                                imageUrls.push(`images/${block.attrs.id}`);
                            }
                            if (block.type === 'file' && block.attrs.id) {
                                fileUrls.push(`files/${block.attrs.id}`);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('문서 내용 처리 중 오류:', error);
            }
        }

        const storageDeletePromises = [
            // 문서 내용 삭제
            deleteObject(contentRef).catch(error => {
                console.warn('스토리지 파일 삭제 실패: ', error);
            }),
            
            // 이미지 삭제
            ...imageUrls.map(path => 
                deleteObject(ref(storage, path)).catch(error => {
                    console.warn('이미지 삭제 실패:', error, path);
                })
            ),
            
            // 파일 삭제
            ...fileUrls.map(path => 
                deleteObject(ref(storage, path)).catch(error => {
                    console.warn('파일 삭제 실패:', error, path);
                })
            )
        ];

        console.log('imageUrls: ', imageUrls);
        console.log('fileUrls: ', fileUrls);

        // 모든 스토리지 삭제 작업을 병렬로 실행
        await Promise.allSettled(storageDeletePromises);

        // 휴지통의 폴더 참조 가져오기
        const trashFolderRef = doc(firestore, 'trash-folders', folderId);
        const trashFolderSnap = await getDoc(trashFolderRef);

        const trashFolderData = trashFolderSnap.data();

        // 배치 작업 시작
        const batch = writeBatch(firestore);

        // 삭제할 문서가 참조하고 있는 폴더가 휴지통에 있을 수도, 없을 수도 있음
        // 있다면 폴더에서 문서 ID를 제거해줘야 함
        if (trashFolderSnap && trashFolderData) {
            const updatedDocumentIds = trashFolderData.documentIds.filter((id: string) => id !== docId);
            batch.update(trashFolderRef, { documentIds: updatedDocumentIds });
        }

        // 원본 문서 삭제
        batch.delete(trashDocRef);

        // 배치 작업 실행
        await batch.commit();

        return NextResponse.json({ success: "문서와 삭제 성공" }, { status: 200 });
    } catch (error) {
        console.error('문서 삭제 실패:', error);
        return NextResponse.json({ error: "문서 삭제 실패" }, { status: 500 });
    }
}