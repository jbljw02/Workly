import { useAppSelector } from "@/redux/hooks";
import { SearchCategory } from "../Trash";
import TrashItem from "./TrashItem";
import { useMemo } from "react";
import EmptyTrashIcon from '../../../../public/svgs/empty-trash.svg';

type TrashListProps = {
    searchedInput: string;
    searchCategory: SearchCategory;
}

export default function TrashList({ searchedInput, searchCategory }: TrashListProps) {
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    // 문서와 폴더 중 출력하는 항목에 따라 다른 값 반환
    const trashList = useMemo(() => searchCategory === '문서' ?
        documentsTrash.filter(document => document.title.includes(searchedInput)) :
        foldersTrash.filter(folder => folder.name.includes(searchedInput)),
        [searchCategory, documentsTrash, foldersTrash, searchedInput]);

    return (
        <div className="flex flex-col mt-1 flex-grow overflow-y-auto">
            {
                trashList.length ?
                    trashList.map(document => (
                        <TrashItem
                            item={document}
                            searchCategory={searchCategory} />
                    )) :
                    <div className="flex flex-col items-center justify-center text-neutral-500 h-full gap-3 pb-6">
                        <EmptyTrashIcon width="33" />
                        <div className="text-sm">
                            {
                                searchedInput.length > 0 ?
                                    '일치하는 검색 결과가 없습니다.' :
                                    '휴지통이 비어있습니다.'
                            }
                        </div>
                    </div>
            }
        </div>
    )
}