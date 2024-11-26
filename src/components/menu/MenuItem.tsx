import { useAppSelector } from "@/redux/hooks";

export type MenuItemProps = {
    Icon: React.ElementType;
    IconWidth: string;
    label: string;
    onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    horizonLine?: boolean;
};

export default function MenuItem({ Icon, IconWidth, label, onClick }: MenuItemProps) {
    const itemClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
    };
    return (
        <li
            className="flex flex-row items-center w-full py-1 pl-3 pr-10 hover:bg-gray-100 select-none cursor-pointer"
            onClick={itemClick}>
            <Icon width={IconWidth} />
            <div className="ml-2">{label}</div>
        </li>
    )
}