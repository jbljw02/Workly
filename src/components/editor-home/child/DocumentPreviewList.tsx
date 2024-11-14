import { useAppSelector } from "@/redux/hooks";
import DocumentPreviewItem from "./DocumentPreviewItem";
import AddNoteIcon from '../../../../public/svgs/add-note.svg';
import { useMemo, useState } from "react";
import CategoryButton from "@/components/button/CategoryButton";
import React from "react";

export default function DocumentPreviewList() {
    const documents = useAppSelector(state => state.documents);
    const [sortCategory, setSortCategory] = useState<'최근 문서' | '공유중인 문서'>('최근 문서');

    console.log('documents:', documents);

    // 카테고리에 따른 필터링 된 문서 목록
    const filteredDocuments = useMemo(() => {
        // 문서를 최신순으로 정렬
        const sorted = [...documents].sort((a, b) => {
            const aTime = a.readedAt.seconds * 1000 + a.readedAt.nanoseconds / 1000000;
            const bTime = b.readedAt.seconds * 1000 + b.readedAt.nanoseconds / 1000000;
            return bTime - aTime;
        });

        // 공유중인 문서 필터링
        if (sortCategory === '공유중인 문서') {
            return sorted.filter(doc => doc.collaborators.length > 0);
        }

        return sorted;
    }, [documents, sortCategory]);

    return (
        <div className="flex flex-col gap-3 px-12">
            <div className="text-xl font-semibold pl-0.5">문서</div>
            <div className="flex flex-row gap-3 mb-1">
                <CategoryButton
                    label="최근 문서"
                    activated={sortCategory === '최근 문서'}
                    onClick={() => setSortCategory('최근 문서')} />
                <CategoryButton
                    label="공유중인 문서"
                    activated={sortCategory === '공유중인 문서'}
                    onClick={() => setSortCategory('공유중인 문서')} />
            </div>
            <div className="flex flex-wrap gap-5 overflow-hidden">
                {
                    filteredDocuments.map(doc => (
                        <React.Fragment key={doc.id}>
                            <DocumentPreviewItem document={doc} />
                        </React.Fragment>
                    ))
                }
                <div
                    className="flex flex-col justify-center items-center border p-4 rounded shadow-sm w-64 h-96 overflow-hidden
                    cursor-pointer hover:bg-gray-100 transition-all duration-150">
                    <div className="flex flex-col items-center  text-neutral-500 gap-3">
                        <AddNoteIcon width="40" />
                        <div className="text-sm font-semibold">새 문서 작성</div>
                    </div>
                </div>
            </div>
        </div>
    )
}