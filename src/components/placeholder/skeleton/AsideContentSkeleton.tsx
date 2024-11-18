import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function AsideContentSkeleton() {
    return (
        <div className="flex flex-col w-full gap-2">
            <Skeleton width={30} height={18} />
            {
                Array(14).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-row items-center gap-2 w-full">
                        <Skeleton width={22} height={22} />
                        <Skeleton width={175} height={22} />
                    </div>
                ))
            }
        </div>
    )
}