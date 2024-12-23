import { ClipLoader } from "react-spinners";

const loaderStyle = {
    border: '2px solid #ffffff'
}

type LoadingSpinnerProps = {
    size: number,
    color: string
}

export default function LoadingSpinner({ size, color }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <ClipLoader
                color={color}
                size={size}
                loading={true}
                cssOverride={loaderStyle} />
        </div>
    );
}