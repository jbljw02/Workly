import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function UserProfileSkeleton() {
    return (
        <div className="flex flex-row items-center gap-3 w-full overflow-hidden">
            <Skeleton
                circle={true}
                width={45}
                height={45} />
            <div className="flex flex-col overflow-hidden w-full">
                <div className="flex flex-col items-center w-full">
                    <Skeleton width={160} height={15} />
                    <Skeleton width={160} height={15} />
                </div>
            </div>
        </div>
    )
}