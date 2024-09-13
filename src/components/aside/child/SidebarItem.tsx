import { SidebarItemProps } from "@/types/sidebarProps";
import PlusIcon from '../../../../public/svgs/plus.svg';

export default function SidebarItem({
    Icon,
    IconWidth,
    label,
    isCollapsed,
    onClick,
    addClick }: SidebarItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex justify-between pl-2 pr-1.5 w-full h-10 rounded cursor-pointer hover:bg-gray-100 group">
            <div className="flex flex-row items-center">
                <Icon width={IconWidth} height={IconWidth} />
                {/* 사이드바가 확장된 경우에만 텍스트 표시 */}
                {
                    !isCollapsed && (
                        <div className="ml-2.5 text-sm whitespace-nowrap overflow-hidden">
                            {label}
                        </div>
                    )
                }
            </div>

            {
                addClick &&
                <div
                    onClick={(e) => {
                        e.stopPropagation();  // 부모 요소로의 이벤트 전파 방지
                        addClick();          // addClick 이벤트 호출
                    }}
                    className="flex items-center h-auto text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusIcon
                        className="hover:bg-gray-200 p-1"
                        width="23" />
                </div>
            }
        </div>
    );
}