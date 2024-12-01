import { useRef, useState } from 'react';
import SearchIcon from '../../../../../public/svgs/search.svg';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import SearchContent from './SearchContent';

export default function SearchInput({ isCollapsed }: { isCollapsed: boolean }) {
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    useClickOutside(searchRef, () => setIsSearching(false));

    return (
        <div
            ref={searchRef}
            className={`relative flex items-center h-9 bg-gray-100 p-1 pl-2 rounded
            ${isCollapsed ? 'cursor-pointer' : ''}`}>
            <SearchIcon width="19px" />
            {
                !isCollapsed && (
                    <input
                        onClick={() => setIsSearching(!isSearching)}
                        className='bg-gray-100 ml-1 border-none outline-none text-sm'
                        placeholder='검색'
                        readOnly />
                )
            }
            {/* 문서를 검색하는 영역 */}
            <SearchContent 
                isSearching={isSearching}
                setIsSearching={setIsSearching} />
        </div>
    )
}