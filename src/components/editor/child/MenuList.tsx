import { useRef } from "react";
import MenuItem from "./MenuItem";
import { MenuItemProps } from "./MenuItem";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import HorizontalDivider from "./divider/HorizontalDivider";

type ListPosition = {
    top: string;
} & (
        // right와 left중 하나만 인자로 받음
        { right: string; left?: never } |
        { left: string; right?: never }
    );

type MenuListProps = {
    menuList: MenuItemProps[];
    setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
    listPositon: ListPosition
}

export default function MenuList({ menuList, setListOpen, listPositon }: MenuListProps) {
    return (
        <div
            className={`absolute bg-white rounded py-1.5 z-10 border border-neutral-300 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]`}
            style={{ top: listPositon.top, right: listPositon.right }}>
            <ul className="list-none text-sm m-0 p-0">
                {
                    menuList.map((item, index) => (
                        <>
                            {
                                item.horizonLine &&
                                <HorizontalDivider borderColor="border-gray-200" />
                            }
                            <MenuItem
                                key={index}
                                Icon={item.Icon}
                                IconWidth={item.IconWidth}
                                label={item.label}
                                onClick={(e) => {
                                    item.onClick(e);
                                    setListOpen(false);
                                }} />
                        </>
                    ))
                }
            </ul>
        </div>
    )
}