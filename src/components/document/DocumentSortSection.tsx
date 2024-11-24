import { useEffect } from 'react';
import CheckIcon from '../../../public/svgs/check.svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSortRule } from '@/redux/features/documentSlice';

type DocumentSortSectionProps = {
    isSortOpen: boolean;
    setIsSortOpen: (isOpen: boolean) => void;
}

export type SortRule = '생성된 날짜' | '제목' | '최근 열람일';  

export default function DocumentSortSection({ isSortOpen, setIsSortOpen }: DocumentSortSectionProps) {
    const dispatch = useAppDispatch();
    
    const sortRuleList = ['생성된 날짜', '제목', '최근 열람일'];
    const sortRule = useAppSelector(state => state.sortRule);

    const itemClick = (rule: SortRule) => {
        dispatch(setSortRule(rule));
        setIsSortOpen(false);
    }

    return (
        <div className={`absolute top-full right-0 flex flex-col py-1.5 w-[180px] z-20 bg-white rounded shadow-[0px_4px_10px_rgba(0,0,0,0.25)] border border-neutral-200
            transition-opacity duration-200 ease-in-out
            ${isSortOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-sm font-semibold text-[13px] pl-3 py-1 pb-2 text-neutral-600">정렬 기준</div>
            <ul className="flex flex-col text-sm list-none m-0 p-0">
                {
                    sortRuleList.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => itemClick(item as SortRule)}
                            className={`w-full py-1 pl-3 cursor-pointer hover:bg-gray-100 flex items-center justify-between pr-3
                            ${sortRule === item ? 'text-blue-600' : ''}`}>
                            {item}
                            {
                                sortRule === item &&
                                <CheckIcon />
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}