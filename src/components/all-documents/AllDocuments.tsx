'use client';

import { useAppSelector } from "@/redux/hooks";
import DocumentHeader from "../document/DocumentHeader";
import DocumentList from "../document/DocumentList";
import DocumentListHeader from "../document/DocumentListHeader";

export default function AllDocuments() {
    const documents = useAppSelector(state => state.documents);
    const user = useAppSelector(state => state.user);

    const usersDocuments = documents.filter(doc => doc.author.email === user.email);

    return (
        <div className="flex flex-col w-full">
            <DocumentHeader
                title="문서"
                description="7개의 문서" />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 공유중인 문서 목록 나열 */}
            <DocumentList documents={usersDocuments} />
        </div>
    )
}