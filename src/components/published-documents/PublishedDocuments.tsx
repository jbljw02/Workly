'use client';

import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";
import DocumentHeader from "../document/DocumentHeader";
import DocumentListHeader from "../document/DocumentListHeader";
import DocumentList from "../document/DocumentList";

export default function PublishedDocuments() {
    const documents = useAppSelector(state => state.documents);

    // 게시된 문서들을 필터링
    const publishedDocuments = useMemo(() => {
        return documents.filter(doc => doc.isPublished);
    }, [documents]);

    console.log("documents: ", documents);
    console.log("publishedDocuments: ", publishedDocuments);

    return (
        <div className="flex flex-col w-full">
            <DocumentHeader
                title="웹 페이지로 게시된 문서"
                description={`${publishedDocuments.length}개의 문서`} />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 공유중인 문서 목록 나열 */}
            <DocumentList
                documents={publishedDocuments}
                isPublished={true} />
        </div>
    );
}