import { useClickOutside } from "@/components/hooks/useClickOutside";
import { useRef, useState } from "react";
import TriangleDownIcon from '../../../../public/svgs/editor/triangle-down.svg'
import TriangleRightIcon from '../../../../public/svgs/editor/triangle-right.svg'
import TriangleUpIcon from '../../../../public/svgs/editor/triangle-up.svg'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setEditorScale } from "@/redux/features/scaleSlice";

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
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                onMouseDown={(e) => e.preventDefault()} // 드래그 상태을 유지
                className="flex flex-row items-center hover:bg-gray-100 rounded p-2 cursor-pointer">
                {/* 현재 선택된 옵션을 출력 */}
                <div className="rounded-md text-sm pr-2">
                    {editorScale * 100}%
                </div>
                {
                    isOpen ?
                        <TriangleUpIcon width="14" /> :
                        <TriangleDownIcon width="14" />
                }
            </div>
            {
                isOpen && (
                    <div className="absolute left-0 right-0 w-16 items-center justify-center bg-white border border-gray-200 rounded-sm mt-1 shadow-lg z-10 text-sm cursor-pointer">
                        {
                            scales.map((scale, index) => (
                                <div
                                    key={index}
                                    onClick={() => changeScale(scale)}
                                    className={`flex flex-row justify-center hover:bg-gray-100 pt-2.5 pb-2.5
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