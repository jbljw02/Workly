import LoadingSpinner from "@/components/placeholder/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";

type ImageCropBar = {
    cropApply: () => void;
    cropCancel: () => void;
}

export default function ImageCropBar({   cropApply, cropCancel }: ImageCropBar) {
    const workingSpinner = useAppSelector(state => state.workingSpinner);
    const cropMode = useAppSelector(state => state.cropMode);
    return (
        <div className={`flex flex-row items-center w-[84px] absolute bottom-[-48px] left-1/2 -translate-x-1/2 transform px-1 py-2 text-sm rounded-md z-20 bg-white border border-gray-200 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]
            transition-opacity duration-200 ease-in-out
            ${cropMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {
                workingSpinner ?
                    <LoadingSpinner size={20} color="#212121" /> :
                    <>
                        <button
                            className='px-1.5 font-semibold rounded-sm hover:bg-gray-100'
                            onClick={cropApply}>저장</button>
                        <button
                            className='px-1.5 rounded-sm text-neutral-500 hover:bg-gray-100'
                            onClick={cropCancel}>취소</button>
                    </>
            }
        </div>
    )
}