import LabelButton from "../button/LabelButton";
import SortIcon from '../../../public/svgs/sort.svg'
import { useRef, useState } from "react";
import DocumentSortSection, { SortRule } from "./DocumentSortSection";
import { useClickOutside } from "../hooks/useClickOutside";
import { useAppSelector } from "@/redux/hooks";

export default function DocumentListHeader() {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRule = useAppSelector(state => state.sortRule);

    const sortRef = useRef<HTMLDivElement>(null);

    useClickOutside(sortRef, () => setIsSortOpen(false));

    return (
        <div className="flex flex-row w-full px-12" >
            <div className="flex-1 border-b text-left">
                <div className='inline-block px-1 pb-2 border-b-2 border-black font-semibold relative'>
                    제목
                    <div className="absolute bottom-0 left-0 w-full h-0.1 bg-black" />
                </div>
            </div>
            <div className="border-b text-left">
                <div
                    ref={sortRef}
                    className="relative flex justify-end">
                    <LabelButton
                        Icon={SortIcon}
                        iconWidth={23}
                        hover="hover:bg-gray-100"
                        onClick={() => setIsSortOpen(!isSortOpen)} />
                    <DocumentSortSection
                        isSortOpen={isSortOpen}
                        setIsSortOpen={setIsSortOpen} />
                </div>
            </div>
        </div>
    )
}