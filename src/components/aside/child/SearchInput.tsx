import SearchIcon from '../../../../public/svgs/search.svg';

export default function SearchInput({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <div className={`flex items-center h-9 bg-neutral-100 p-1 pl-2 rounded text-sm whitespace-nowrap overflow-hidden 
        ${isCollapsed ? 'cursor-pointer' : ''}`}>
            <SearchIcon width="19px" />
            {
                !isCollapsed && (
                    <input
                        className='bg-neutral-100 ml-1 border-none outline-none'
                        placeholder='검색'
                        readOnly />
                )
            }
        </div>
    )
}