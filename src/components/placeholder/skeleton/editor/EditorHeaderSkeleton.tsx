import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function EditorHeaderSkeleton() {
    return (
        <div className="flex flex-col sticky top-0 bg-white z-10 border-b">
            <div className="flex flex-row items-center justify-between w-full border-b p-3">
                <Skeleton width={200} height={32} />
                <Skeleton width={200} height={32} />
            </div>
            <div className="px-3 w-full h-auto pt-2 pb-3">
                <Skeleton width='80%' height={32} />
            </div>
        </div>
    )
}