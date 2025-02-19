'use client';

import { useAppSelector } from "@/redux/hooks";
import DocumentHeader from "../document/DocumentHeader";
import DocumentList from "../document/DocumentList";
import DocumentListHeader from "../document/DocumentListHeader";
import { useMemo } from "react";

export default function AllDocuments() {
    const documents = useAppSelector(state => state.documents);
    const user = useAppSelector(state => state.user);
    const sortRule = useAppSelector(state => state.sortRule);
    
    // 사용자의 문서들을 필터링하고 정렬
    const usersDocuments = useMemo(() => {
        const filtered = documents.filter(doc => doc.author.email === user.email);
        
        return [...filtered].sort((a, b) => {
            if (sortRule === '생성된 날짜') {
                return a.createdAt.seconds - b.createdAt.seconds;
            }
            else if (sortRule === '제목') {
                return a.title.localeCompare(b.title);
            }
            else if (sortRule === '최근 열람일') {
                return b.readedAt.seconds - a.readedAt.seconds;
            }
            else {
                return filtered.length;
            }
        });
    }, [documents, user.email, sortRule]);

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <DocumentHeader
                title="문서"
                description='내가 생성한 문서' />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 공유중인 문서 목록 나열 */}
            <DocumentList documents={usersDocuments} />
        </div>
    )
}