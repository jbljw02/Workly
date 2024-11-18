import { useClickOutside } from "@/components/hooks/useClickOutside";
import { useRef, useState } from "react";
import TriangleDownIcon from '../../../../public/svgs/editor/triangle-down.svg'
import TriangleRightIcon from '../../../../public/svgs/editor/triangle-right.svg'
import TriangleUpIcon from '../../../../public/svgs/editor/triangle-up.svg'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setEditorScale } from "@/redux/features/scaleSlice";
import HoverTooltip from "../../../tooltip/HoverTooltip";

export default function RatioDropdown() {
    const dispatch = useAppDispatch();

    const editorScale = useAppSelector(state => state.editorScale);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const scales: number[] = [50, 75, 100, 125, 150, 175, 200];

    const changeScale = (scale: number) => {
        scale /= 100; // 150, 50과 같은 값으로 연산할 수 없으니 1.5, 0.5등으로 만듦
        dispatch(setEditorScale(scale));
        setIsOpen(false);
    }

    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div
            className="relative w-20"
            ref={dropdownRef}>
            <HoverTooltip label="화면 비율">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseDown={(e) => e.preventDefault()} // 드래그 상태를 유지
                    className="flex flex-row items-center justify-between hover:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">
                    {/* 현재 선택된 옵션을 출력 */}
                    <div className="rounded-md text-sm">
                        {editorScale * 100}%
                    </div>
                    {
                        isOpen ?
                            <TriangleUpIcon width="14" /> :
                            <TriangleDownIcon width="14" />
                    }
                </div>
            </HoverTooltip>
            {
                // 선택 가능한 확대 비율 나열
                isOpen && (
                    <div className="absolute -left-1 right-0 items-center bg-white border border-gray-200 rounded-sm mt-1 z-20 shadow-lg text-sm cursor-pointer">
                        {
                            scales.map((scale, index) => (
                                <div
                                    key={index}
                                    onClick={() => changeScale(scale)}
                                    className={`flex flex-row justify-start hover:bg-gray-100 py-2.5 pl-2
                                        ${scale === editorScale * 100 ? 'bg-gray-100' : ''}`}>
                                    <div className="pl-1">{scale}%</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>

    )
}