import PlusIcon from '../../../../public/svgs/plus.svg';
import GroupHoverItem from "./GroupHoverItem";
import LockIcon from '../../../../public/svgs/editor/lock.svg';

type SidebarItemProps = {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    IconWidth: string;
    label: string;
    isCollapsed?: boolean;
    onClick?: () => void;
    addClick?: () => void;
    disabled?: boolean;
}

export default function SidebarItem({
    Icon,
    IconWidth,
    label,
    isCollapsed,
    onClick,
    addClick,
    disabled
}: SidebarItemProps) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`flex justify-between pl-2.5 pr-1.5 w-full h-9 rounded
                ${disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100 group'}`}>
            <div className="flex flex-row items-center">
                {
                    disabled ?
                        <LockIcon width="16" className="text-gray-400" /> :
                        <Icon width={IconWidth} height={IconWidth} />
                }
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
                <GroupHoverItem
                    Icon={PlusIcon}
                    IconWidth={15}
                    onClick={(e) => {
                        e.stopPropagation();
                        addClick();
                    }} />
            }
        </div>
    );
}