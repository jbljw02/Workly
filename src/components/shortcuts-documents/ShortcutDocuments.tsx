'use client';

import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";
import DocumentHeader from "../document/DocumentHeader";
import DocumentListHeader from "../document/DocumentListHeader";
import DocumentList from "../document/DocumentList";

export default function ShortcutDocuments() {
    const user = useAppSelector(state => state.user);
    const documents = useAppSelector(state => state.documents);
    // 즐겨찾기 문서 목록
    const shortcutsDocuments = useMemo(() => documents.filter(doc => doc.shortcutsUsers?.includes(user.email)), [documents, user]);
    return (
        <div className="flex flex-col w-full">
            <DocumentHeader
                title="즐겨찾기"
                description={`${shortcutsDocuments.length}개의 즐겨찾기 문서`} />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 즐겨찾기 문서 목록 나열 */}
            <DocumentList documents={shortcutsDocuments} />
        </div>
    )
}