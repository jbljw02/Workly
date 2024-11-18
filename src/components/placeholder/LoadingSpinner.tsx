import { ClipLoader } from "react-spinners";

const loaderStyle = {
    border: '2px solid #ffffff'
}

type LoadingSpinnerProps = {
    size: number,
}

export default function LoadingSpinner({ size }: LoadingSpinnerProps) {
    return (
        <div
            className="flex items-center justify-center w-full h-full">
            <ClipLoader
                color="#ffffff"
                size={size}
                loading={true}
                cssOverride={loaderStyle} />
        </div>
    );
}