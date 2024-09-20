type ImageCropBar = {
    cropApply: () => void;
    cropCancel: () => void;
}

export default function ImageCropBar({ cropApply, cropCancel }: ImageCropBar) {
    return (
        <div className='flex flex-row items-center absolute bottom-[-50px] p-1 text-sm rounded-md z-[9999] bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.25)]'>
            <button
                className='p-1 font-semibold rounded-sm hover:bg-gray-100'
                onClick={cropApply}>저장</button>
            <button
                className='p-1 rounded-sm text-neutral-500 hover:bg-gray-100'
                onClick={cropCancel}>취소</button>
        </div>
    )
}