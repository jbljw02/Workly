import DocumentIcon from '../../../../public/svgs/document.svg'

export default function EditorHeader() {

    return (
        <div className='flex flex-row px-3 py-2 border-b'>
            <div className='flex flex-row items-center ml-1'>
                <div className='flex flex-row'>
                    <div className='text-base'>미국 여행</div>
                </div>
                <div className='flex flex-row mt-1 ml-1.5 text-xs text-neutral-400 cursor-pointer select-none'>
                    세계 일주
                </div>
            </div>
        </div>
    )
}