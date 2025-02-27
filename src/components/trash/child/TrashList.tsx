import { useAppSelector } from "@/redux/hooks";
import { SearchCategory } from "../Trash";
import TrashItem from "./TrashItem";
import { useMemo } from "react";
import React from "react";
import HoverListSkeleton from "@/components/placeholder/skeleton/HoverListSkeleton";
import EmptyList from "@/components/placeholder/EmptyList";

type TrashListProps = {
    searchedInput: string;
    searchCategory: SearchCategory;
}

export default function TrashList({ searchedInput, searchCategory }: TrashListProps) {
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);
    const isTrashLoading = useAppSelector(state => state.loading.isTrashLoading);

    // 문서와 폴더 중 출력하는 항목에 따라 다른 값 반환
    const trashList = useMemo(() => searchCategory === '문서' ?
        documentsTrash.filter(document => document.title.includes(searchedInput)) :
        foldersTrash.filter(folder => folder.name.includes(searchedInput)),
        [searchCategory, documentsTrash, foldersTrash, searchedInput]);

    return (
        <div className="flex flex-col mt-1 flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin">
            {
                isTrashLoading && trashList.length === 0 ?
                    <HoverListSkeleton /> :
                    (
                        trashList.length ?
                            trashList.map(document => (
                                <React.Fragment key={document.id}>
                                    <TrashItem
                                        trashItem={document}
                                        searchCategory={searchCategory} />
                                </React.Fragment>
                            )) :
                            <EmptyList
                                type="trash"
                                textSize="sm"
                                iconWidth="28"
                                description="휴지통이 비어있습니다." />
                    )
            }
        </div>
    )
}