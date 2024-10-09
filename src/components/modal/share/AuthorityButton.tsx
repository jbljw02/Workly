import ArrowIcon from '../../../../public/svgs/down-arrow.svg';

export default function AuthorityButton() {
    return (
        <button className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-100'>
            <div className='whitespace-nowrap text-sm'>전체 허용</div>
            <ArrowIcon width="17" />
        </button>
    )
}