import SearchIcon from '../../../../public/svgs/search.svg'

export default function SearchInput() {
    return (
        <div className='flex items-center mb-1 bg-neutral-100 p-1 pt-2 pb-2 pl-2 rounded text-sm'>
            <SearchIcon width="19px" />
            <input
                className='bg-neutral-100 ml-1 border-none outline-none'
                placeholder='검색'
                readOnly />
        </div>
    )
}