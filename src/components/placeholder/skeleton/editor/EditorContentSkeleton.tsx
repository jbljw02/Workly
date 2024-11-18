import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function EditorContentSkeleton() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <Skeleton width={200} height={50} />
            <div className="flex flex-col gap-1.5">
                <Skeleton width='80%' height={35} />
                <Skeleton width='80%' height={35} />
                <Skeleton width='80%' height={35} />
            </div>
        </div>
    )
}