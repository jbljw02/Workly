import { useAppSelector } from "@/redux/hooks";
import DocumentPreviewItem from "./DocumentPreviewItem";
import AddNoteIcon from '../../../../public/svgs/add-note.svg';
import { useMemo, useState } from "react";
import CategoryButton from "@/components/button/CategoryButton";
import React from "react";
import AddInputModal from "@/components/modal/AddInputModal";
import useAddDocument from "@/components/hooks/useAddDocument";
import DocumentPreviewSkeleton from "@/components/placeholder/skeleton/DocumentPreviewSkeleton";

export default function DocumentPreviewList() {
    const addDocToFolder = useAddDocument();

    const folders = useAppSelector(state => state.folders);
    const documents = useAppSelector(state => state.documents);
    const isDocumentLoading = useAppSelector(state => state.loading.isDocumentLoading);

    const [sortCategory, setSortCategory] = useState<'최근 문서' | '공유중인 문서'>('최근 문서');
    const [isAdding, setIsAdding] = useState(false);
    const [docTitle, setDocTitle] = useState('');
    const [isDocInvalidInfo, setIsDocInvalidInfo] = useState({
        isInvalid: false,
        msg: ''
    });

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
        <div className="flex flex-col gap-3 px-12 w-full">
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
            {
                // 문서 목록이 로딩중이며 표시할 문서가 없으면 정보를 받아오는 중이라는 뜻이므로 스켈레톤 출력
                isDocumentLoading && filteredDocuments.length === 0 ?
                    <DocumentPreviewSkeleton /> :
                    <div className="flex flex-wrap gap-5 overflow-hidden mb-11">
                        {
                            filteredDocuments.map(doc => (
                                <React.Fragment key={doc.id}>
                                    <DocumentPreviewItem document={doc} />
                                </React.Fragment>
                            ))
                        }
                        {/* 새 문서를 작성하는 영역 */}
                        <div
                            onClick={() => setIsAdding(true)}
                            className="flex flex-col justify-center items-center border p-4 rounded shadow-sm w-64 h-96 overflow-hidden
                            cursor-pointer hover:bg-gray-100 transition-all duration-150">
                            <div className="flex flex-col items-center  text-neutral-500 gap-3">
                                <AddNoteIcon width="40" />
                                <div className="text-sm font-semibold">새 문서 작성</div>
                            </div>
                        </div>
                        <AddInputModal
                            isModalOpen={isAdding}
                            setIsModalOpen={setIsAdding}
                            value={docTitle}
                            setValue={setDocTitle}
                            submitFunction={() => addDocToFolder(docTitle, folders[0], setIsDocInvalidInfo)}
                            category='document'
                            isInvalidInfo={isDocInvalidInfo}
                            setIsInvalidInfo={setIsDocInvalidInfo} />
                    </div>
            }
        </div>
    )
}