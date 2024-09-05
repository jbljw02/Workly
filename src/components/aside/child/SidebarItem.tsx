import { SidebarItemProps } from "@/types/sidebarProps";

export default function SidebarItem({ Icon, IconWidth, label, isCollapsed }: SidebarItemProps) {
    return (
        <div
            className="flex items-center pl-2 w-full h-10 rounded cursor-pointer hover:bg-gray-100">
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
    );
}