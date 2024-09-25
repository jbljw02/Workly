import { useState } from "react";

type HoverTooltipProps = {
    label: string;
    children: React.ReactNode;
}

export default function HoverTooltip({ label, children }: HoverTooltipProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {/* 툴팁 컴포넌트를 부모 요소로 만들고 children으로 자식 요소를 삽입 */}
            {children}
            {
                isHovered && (
                    <div className="absolute mt-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {label}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
