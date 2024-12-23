import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfileSectionSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3 w-full overflow-hidden">
            <Skeleton
                circle={true}
                width={100}
                height={100} />
            <div className="flex flex-col items-center overflow-hidden w-full">
                <Skeleton width={175} height={20} />
                <Skeleton width={175} height={20} />
            </div>
        </div>
    )
}