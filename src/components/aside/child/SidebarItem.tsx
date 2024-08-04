import { SidebarItemProps } from "@/type/sidebarProps";

interface Props extends SidebarItemProps {
    isCollapsed?: boolean;
}

export default function SidebarItem({ Icon, IconWidth, label, isCollapsed }: Props) {
    return (
        <div className="flex items-center pl-2 pt-2 pb-2 w-full rounded cursor-pointer hover:bg-neutral-100">
            {/* Tailwind CSS를 사용하여 아이콘의 크기를 고정합니다. */}
            <div className={`w-${IconWidth} h-${IconWidth}`}>
                <Icon width={IconWidth} height={IconWidth} />
            </div>
            {/* 사이드바가 확장된 경우에만 텍스트 표시 */}
            {!isCollapsed && (
                <div className="ml-2.5 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {label}
                </div>
            )}
        </div>
    );
}