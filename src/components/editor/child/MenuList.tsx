import { useRef } from "react";
import MenuItem from "./MenuItem";
import { MenuItemProps } from "./MenuItem";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import HorizontalDivider from "./divider/HorizontalDivider";
import CopyIcon from '../../../../public/svgs/editor/copy.svg'

type MenuListProps = {
    menuList: MenuItemProps[];
    setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
    listPositon: { top: string, right: string }
}

export default function MenuList({ menuList, setListOpen, listPositon }: MenuListProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setListOpen(false));
    
    return (
        <div
            ref={menuRef}
            className={`absolute bg-white rounded-md py-1.5 z-10 border border-neutral-300 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]`}
            style={{ top: listPositon.top, right: listPositon.right }}>
            <ul className="list-none text-sm m-0 p-0">
                {
                    menuList.map((item, index) => (
                        <>
                            {
                                item.horizonLine &&
                                <HorizontalDivider />
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