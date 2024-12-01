import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function HoverListSkeleton() {
    return (
        <div className="flex flex-col w-full gap-2 mx-4 overflow-hidden">
            {
                Array(8).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-row items-center gap-2 w-full">
                        <Skeleton width={30} height={30} />
                        <Skeleton width={305} height={30} />
                    </div>
                ))
            }
        </div>
    )
}