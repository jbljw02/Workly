'use client';

import { DocumentProps } from "@/types/document.type";
import DocumentListItem from "./DocumentListItem";
import React from "react";
import DocumentListSkeleton from "../placeholder/skeleton/DocumentListSkeleton";
import { useAppSelector } from "@/redux/hooks";
import EmptyList from "../placeholder/EmptyList";

type DocumentListProps = {
    documents: DocumentProps[];
    isShared?: boolean;
    isPublished?: boolean;
}

export default function DocumentList({ documents, isShared, isPublished }: DocumentListProps) {
    const isDocumentLoading = useAppSelector(state => state.loading.isDocumentLoading);
    return (
        <div className='flex flex-col w-full h-full'>
            {
                isDocumentLoading && documents.length === 0 ?
                    <DocumentListSkeleton /> :
                    documents.length > 0 ?
                        (
                            documents.map(document => (
                                <React.Fragment key={document.id}>
                                    <DocumentListItem
                                        document={document}
                                        isShared={isShared}
                                        isPublished={isPublished} />
                                </React.Fragment>
                            ))
                        ) :
                        (
                            <EmptyList
                                type="document"
                                textSize="lg"
                                iconWidth="48"
                                description="아직 문서가 존재하지 않습니다." />
                        )
            }
        </div>
    )
}