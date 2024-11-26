import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type HoverTooltipProps = {
    label: string;
    children: React.ReactNode;
}

export default function HoverTooltip({ label, children }: HoverTooltipProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isHovered && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPosition({
                top: rect.bottom + 5,
                left: rect.left + (rect.width / 2),
            });
        }
    }, [isHovered]);

    return (
        <div
            ref={containerRef}
            className="inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {children}
            {
                isHovered && createPortal(
                    <div
                        className="fixed transform -translate-x-1/2 pointer-events-none"
                        style={{
                            top: `${tooltipPosition.top}px`,
                            left: `${tooltipPosition.left}px`,
                            zIndex: 503,
                            visibility: `${tooltipPosition.top === 0 || tooltipPosition.left === 0 ?
                                'hidden' :
                                'visible'}`
                        }}>
                        <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {label}
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
}
