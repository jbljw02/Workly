import { useAppSelector } from "@/redux/hooks";
import { Dispatch, SetStateAction, useMemo } from "react";
import HoverListSkeleton from "@/components/placeholder/skeleton/HoverListSkeleton";
import DocumentIcon from '../../../../../public/svgs/shared-document.svg';
import EmptyFolderIcon from '../../../../../public/svgs/empty-folder.svg';
import { DocumentProps } from "@/redux/features/documentSlice";
import React from "react";
import EmptyList from "@/components/placeholder/EmptyList";
import { useRouter } from "next-nprogress-bar";

type SearchedDocumentListProps = {
    searchedInput: string;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
}

type SearchedDocumentItemProps = {
    document: DocumentProps;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
}

function SearchedDocumentItem({ document, setIsSearching }: SearchedDocumentItemProps) {
    const router = useRouter();

    const itemClick = () => {
        router.push(`/editor/${document.folderId}/${document.id}`);
        setIsSearching(false);
    }

    return (
        <div
            onClick={itemClick}
            className="flex flex-row items-center justify-between w-full py-1.5 px-4 hover:bg-gray-100 select-none cursor-pointer">
            <div className="flex flex-row items-center gap-2.5">
                <div className='flex items-center justify-center p-1 w-9 h-9 rounded-lg border-gray-200 border'>
                    <DocumentIcon
                        className="text-gray-500"
                        width="25" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="text-[13px] truncate">
                        {document.title || '제목 없는 문서'}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                        {document.folderName}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SearchedDocumentList({ searchedInput, setIsSearching }: SearchedDocumentListProps) {
    const documents = useAppSelector(state => state.documents);
    const isDocumentLoading = useAppSelector(state => state.loading.isDocumentLoading);

    // 검색 결과 목록
    // 검색어가 없으면 모든 문서를 반환, 검색어가 있으면 검색어에 따라서 필터링
    const searchedDocuments = useMemo(() =>
        searchedInput === '' ?
            documents :
            documents.filter(document => document.title.includes(searchedInput)),
        [documents, searchedInput]);

    return (
        <div className="flex flex-col mt-1 flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin">
            {
                // 문서 리스트 자체가 로딩중이면 스켈레톤 출력
                isDocumentLoading && documents.length == 0 ?
                    <HoverListSkeleton /> :
                    // 검색 결과가 있으면 검색 결과 출력
                    searchedDocuments.length > 0 ?
                        searchedDocuments.map(document => (
                            <React.Fragment key={document.id}>
                                <SearchedDocumentItem
                                    document={document}
                                    setIsSearching={setIsSearching} />
                            </React.Fragment>
                        )) :
                        <EmptyList
                            type="document"
                            textSize="sm"
                            iconWidth="40"
                            description="일치하는 검색 결과가 없습니다." />
            }
        </div>
    )
}