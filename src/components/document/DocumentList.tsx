'use client';

import { DocumentProps, toggleShortcut } from "@/redux/features/documentSlice";
import EmptyFolderIcon from '../../../public/svgs/empty-folder.svg';
import DocumentListItem from "./DocumentListItem";
import React from "react";

type DocumentListProps = {
    documents: DocumentProps[];
    isShared?: boolean;
    isPublished?: boolean;
}

export default function DocumentList({ documents, isShared, isPublished }: DocumentListProps) {
    return (
        <div className='flex flex-col w-full h-full'>
            {
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
                        <div className="flex items-center justify-center w-full h-full text-neutral-500 gap-4 mb-14">
                            <EmptyFolderIcon width="48" />
                            <div className="text-lg">아직 문서가 존재하지 않습니다.</div>
                        </div>
                    )
            }
        </div>
    )
}