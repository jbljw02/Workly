import { Collaborator } from "@/redux/features/documentSlice";
import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../firebase/firestore";

// 휴지통에 있는 사용자의 문서 요청 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const email = searchParams.get('email');
        console.log('email: ', email);

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });

        // documents 컬렉션에서 모든 문서 가져오기
        const trashDocumentsCollection = collection(firestore, 'trash-documents');
        const trashDocumentsSnapshot = await getDocs(trashDocumentsCollection);

        // 모든 문서를 추출
        const trashDocuments = trashDocumentsSnapshot.docs.map(doc => doc.data());

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

        const email = searchParams.get('email');
        const docId = searchParams.get('docId');
        const folderId = searchParams.get('folderId');

        if (!email) return NextResponse.json({ error: "이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!folderId) return NextResponse.json({ error: "폴더 ID가 제공되지 않음" }, { status: 400 });

        const trashDocRef = doc(firestore, 'trash-documents', docId);
        const trashDocSnap = await getDoc(trashDocRef);

        if (!trashDocSnap.exists()) {
            return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });
        }

        // 폴더 참조 가져오기
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

        return NextResponse.json({ success: "문서가 영구 삭제됨" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서 삭제 실패" }, { status: 500 });
    }
}