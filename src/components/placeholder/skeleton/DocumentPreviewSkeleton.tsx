import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DocumentPreviewSkeleton() {
    return (
        <div className="flex flex-wrap gap-5 overflow-hidden mb-11">
            {
                Array(10).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="rounded shadow-sm w-[254px] h-96">
                        <Skeleton width="100%" height="100%" />
                    </div>
                ))
            }
        </div>
    );
}