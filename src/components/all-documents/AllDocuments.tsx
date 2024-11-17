'use client';

import { useAppSelector } from "@/redux/hooks";
import DocumentHeader from "../document/DocumentHeader";
import DocumentList from "../document/DocumentList";
import DocumentListHeader from "../document/DocumentListHeader";
import { useMemo } from "react";
import DocumentListSkeleton from "../placeholder/skeleton/DocumentListSkeleton";

export default function AllDocuments() {
    const documents = useAppSelector(state => state.documents);
    const user = useAppSelector(state => state.user);

    // 사용자의 문서들을 필터링
    const usersDocuments = useMemo(() => {
        return documents.filter(doc => doc.author.email === user.email);
    }, [documents]);

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <DocumentHeader
                title="문서"
                description={`${usersDocuments.length}개의 문서`} />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 공유중인 문서 목록 나열 */}
            <DocumentList documents={usersDocuments} />
        </div>
    )
}