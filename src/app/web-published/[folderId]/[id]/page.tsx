import PublishedDocument from "@/components/web-published/WebPublishedDocument";
import firestore from "@/firebase/firestore";
import { DocumentProps } from "@/redux/features/documentSlice";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getDocumentMetadata } from "@/utils/getDocumentMetadata";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const metadata = await getDocumentMetadata(params.id);
    if (!metadata) {
        return redirect('/document-not-found');
    }
    return metadata;
}

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
        return redirect('/document-not-found');
    }
    
    const document = docSnap.data();

    // 게시된 문서 내용 가져오기
    const storage = getStorage();
    const contentRef = ref(storage, `documents/published/${params.id}/content.json`);
    const contentUrl = await getDownloadURL(contentRef);

    const response = await fetch(contentUrl);
    if (!response.ok) {
        return redirect('/document-not-found');
    }
    
    const content = await response.json();

    return (
        <PublishedDocument
            document={document}
            content={content} />
    );
}