import PublishedDocument from "@/components/web-published/WebPublishedDocument";
import firestore from "@/firebase/firestore";
import { DocumentProps } from "@/redux/features/documentSlice";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function PublishedPage({ params }: {
    params: {
        folderId: string;
        id: string;
    }
}) {
    // 문서의 참조를 가져옴
    const docRef = doc(firestore, 'documents', params.id);
    const docSnap = await getDoc(docRef);

    // 문서가 존재하지 않거나 게시되지 않은 경우 리다이렉트
    if (!docSnap.exists() || !docSnap.data().isPublished) {
        redirect('/document/not-found');
    }

    const document = docSnap.data();
    return (
        <PublishedDocument document={document} />
    );
}