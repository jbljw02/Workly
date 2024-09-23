export type MenuItemProps = {
    Icon: React.ElementType;
    IconWidth: string;
    label: string;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    horizonLine?: boolean;
};

export default function MenuItem({ Icon, IconWidth, label, onClick }: MenuItemProps) {
    const itemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
    };
    return (
        <div
            className="flex flex-row items-center w-full py-1 pl-3 pr-10 hover:bg-gray-100 select-none cursor-pointer"
            onClick={itemClick}>
            <Icon width={IconWidth} />
            <div className="ml-2">{label}</div>
        </div>
    )
}