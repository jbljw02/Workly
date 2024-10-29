import { useAppSelector } from "@/redux/hooks";
import { SearchCategory } from "../Trash";
import TrashItem from "./TrashItem";
import { useMemo } from "react";
import EmptyTrashIcon from '../../../../public/svgs/empty-trash.svg';

export default function TrashList({ searchCategory }: { searchCategory: SearchCategory }) {
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    const trashList = useMemo(() => searchCategory === '문서' ?
        documentsTrash :
        foldersTrash,
        [searchCategory, documentsTrash, foldersTrash]);

    return (
        <div className="flex flex-col mt-1 flex-grow">
            {
                trashList.length ?
                    trashList.map(document => (
                        <TrashItem
                            item={document}
                            searchCategory={searchCategory}
                            trashList={trashList} />
                    )) :
                    <div className="flex flex-col items-center justify-center text-neutral-500 h-full gap-3 pb-6">
                        <EmptyTrashIcon width="33" />
                        <div className="text-sm">휴지통이 비어있습니다.</div>
                    </div>
            }
        </div>
    )
}