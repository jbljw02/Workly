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
            className="flex justify-between pl-2.5 pr-1.5 w-full h-9 rounded cursor-pointer hover:bg-gray-100 group">
            <div className="flex flex-row items-center">
            <Icon width={IconWidth} height={IconWidth} />
                {/* 사이드바가 확장된 경우에만 텍스트 표시 */}
                {
                    !isCollapsed && (
                        <div className="ml-2.5 text-sm whitespace-nowrap select-none overflow-hidden">
                            {label}
                        </div>
                    )
                }
            </div>

            {
                (addClick && !isCollapsed) &&
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        addClick();
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