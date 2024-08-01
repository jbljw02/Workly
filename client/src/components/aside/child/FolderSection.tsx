import PlusIcon from '../../../../public/svgs/plus.svg'

export default function FolderSection() {
    return (
        <div className='mb-5'>
            <div className='text-sm font-semibold ml-2'>폴더</div>
            <div className='flex items-center pl-2 pt-2 pb-2 mt-1 rounded text-neutral-400 hover:bg-neutral-100 cursor-pointer'>
                <PlusIcon width="14" />
                <span className='text-13px ml-2'>새 폴더</span>
            </div>
        </div>
    )
}