import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import firestore from "../../../../firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { Collaborator } from "@/redux/features/documentSlice";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

// 문서에 협업자 추가하기 - CREATE
export async function POST(req: NextRequest) {
    try {
        const { docId, collaborators } = await req.json();

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!collaborators || !Array.isArray(collaborators)) return NextResponse.json({ error: "협업자 목록이 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        // 파이어베이스 스토리지에서 기본 아바타 이미지 가져오기
        const storage = getStorage();
        const avatarRef = ref(storage, 'images/avatar.png');
        const defaultAvatarURL = await getDownloadURL(avatarRef);

        // 프로필 이미지가 미정인 사용자일 경우 photoURL을 아바타 이미지로 변경
        const newCollaborators = collaborators.map(collaborator => ({
            ...collaborator,
            photoURL: collaborator.photoURL === 'unknown-user' ? defaultAvatarURL : collaborator.photoURL
        }));

        // 문서에 새로운 협업자 추가
        await updateDoc(docRef, {
            collaborators: arrayUnion(...newCollaborators)
        });

        return NextResponse.json({ success: "문서에 협업자 추가 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서에 협업자 추가하기 실패" }, { status: 500 });
    }
}

// 문서의 협업자 가져오기 - READ
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const docId = searchParams.get('docId');

        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        const docData = docSnap.data();
        const collaborators = docData.collaborators || [];

        return NextResponse.json(collaborators, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서의 협업자 정보 요청 실패" }, { status: 500 });
    }
}

// 협업자 권한 변경하기 - UPDATE
export async function PUT(req: NextRequest) {
    try {
        const { authorEmail, targetEmail, docId, newAuthority } = await req.json();

        if (!authorEmail) return NextResponse.json({ error: "작성자 이메일이 제공되지 않음" }, { status: 400 });
        if (!targetEmail) return NextResponse.json({ error: "협업자 이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });
        if (!newAuthority) return NextResponse.json({ error: "새 권한이 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        const docData = docSnap.data();

        // 문서의 관리자만 권한을 변경할 수 있도록
        if (docData.author.email !== authorEmail) {
            return NextResponse.json({ error: "권한 변경 권한이 없습니다" }, { status: 403 });
        }

        const collaborators: Collaborator[] = docData.collaborators || [];

        // 변경할 협업자의 이메일을 찾아 권한 업데이트
        const updatedCollaborators = collaborators.map(collab =>
            collab.email === targetEmail ?
                { ...collab, authority: newAuthority } :
                collab
        );

        // 문서 업데이트
        await updateDoc(docRef, {
            collaborators: updatedCollaborators
        });

        return NextResponse.json({ success: "협업자 권한 변경 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "협업자 권한 변경 실패" }, { status: 500 });
    }
}

// 문서의 협업자 제거하기 - DELETE
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const authorEmail = searchParams.get('authorEmail');
        const targetEmail = searchParams.get('targetEmail');
        const docId = searchParams.get('docId');

        if (!authorEmail) return NextResponse.json({ error: "작성자 이메일이 제공되지 않음" }, { status: 400 });
        if (!targetEmail) return NextResponse.json({ error: "협업자 이메일이 제공되지 않음" }, { status: 400 });
        if (!docId) return NextResponse.json({ error: "문서 ID가 제공되지 않음" }, { status: 400 });

        // 문서 정보 가져오기
        const docRef = doc(firestore, 'documents', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return NextResponse.json({ error: "문서를 찾을 수 없음" }, { status: 404 });

        const docData = docSnap.data();

        // 문서 작성자 확인
        if (docData.author.email !== authorEmail) {
            return NextResponse.json({ error: "제거 권한이 없습니다" }, { status: 403 });
        }

        const collaborators: Collaborator[] = docData.collaborators || [];

        // 협업자 목록에서 타겟 협업자 제거
        const updatedCollaborators = collaborators.filter(collab => collab.email !== targetEmail);

        // 협업자가 제거되지 않은 경우(즉, 해당 이메일을 가진 협업자가 없었던 경우)
        if (collaborators.length === updatedCollaborators.length) {
            return NextResponse.json({ error: "해당 협업자를 찾을 수 없음" }, { status: 404 });
        }

        // 문서 업데이트
        await updateDoc(docRef, {
            collaborators: updatedCollaborators
        });

        return NextResponse.json({ success: "문서의 협업자 제거 성공" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "문서의 협업자 제거 실패" }, { status: 500 });
    }
}
