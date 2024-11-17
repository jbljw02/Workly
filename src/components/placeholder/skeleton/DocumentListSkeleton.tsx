import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function DocumentListSkeleton() {
    return (
        <>
            {
                Array(9).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center w-full">
                        <div className="relative flex flex-1 items-center py-3 mx-12">
                            {/* 문서 아이콘 */}
                            <Skeleton width={49} height={49} className="mr-4" />
                            <div className="flex flex-col w-full gap-1">
                                {/* 문서 제목 */}
                                <Skeleton width="100%" height={22} />
                                {/* 문서 정보 */}
                                <Skeleton width="100%" height={20} />
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}