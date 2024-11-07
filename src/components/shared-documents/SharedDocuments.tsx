'use client';

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useMemo } from 'react';
import DocumentListHeader from '../document/DocumentListHeader';
import DocumentList from '../document/DocumentList';
import DocumentHeader from '../document/DocumentHeader';

export default function SharedDocuments() {
    const documents = useAppSelector((state: RootState) => state.documents);
    // 공유중인 문서 목록
    const sharedDocuments = useMemo(() => documents.filter(document => document.collaborators.length > 0), [documents]);
    return (
        <div className="flex flex-col w-full">
            <DocumentHeader
                title="공유중인 문서"
                description="다른 사용자와 함께 작업하고 있는 문서" />
            {/* 목록의 헤더 */}
            <DocumentListHeader />
            {/* 공유중인 문서 목록 나열 */}
            <DocumentList
                documents={sharedDocuments}
                isShared />
        </div>
    )
}