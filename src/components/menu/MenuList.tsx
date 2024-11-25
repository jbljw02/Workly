import React from "react";
import MenuItem from "./MenuItem";
import { MenuItemProps } from "./MenuItem";
import HorizontalDivider from "../editor/child/divider/HorizontalDivider";
import LoadingSpinner from "../placeholder/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";

type ListPosition = {
    top: string;
} & (
        // right와 left중 하나만 인자로 받음
        { right: string; left?: never } |
        { left: string; right?: never }
    );

type MenuListProps = {
    isOpen: boolean;
    menuList: MenuItemProps[];
    setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
    listPositon: ListPosition;
}

export default function MenuList({ isOpen, menuList, setListOpen, listPositon }: MenuListProps) {
    const workingSpinner = useAppSelector(state => state.workingSpinner);
    return (
        <div
            className={`absolute bg-white rounded py-1.5 z-20 border border-neutral-300 shadow-[0px_4px_10px_rgba(0,0,0,0.25)] 
                transition-opacity duration-200 ease-in-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ top: listPositon.top, right: listPositon.right }}>
            <ul className="list-none text-sm m-0 p-0 relative">
                {menuList.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className={workingSpinner ? 'invisible' : 'visible'}>
                            {item.horizonLine &&
                                <HorizontalDivider borderColor="border-gray-200" />
                            }
                            <MenuItem
                                Icon={item.Icon}
                                IconWidth={item.IconWidth}
                                label={item.label}
                                onClick={(e) => {
                                    item.onClick(e);
                                    !workingSpinner && setListOpen(false);
                                }} />
                        </div>
                    </React.Fragment>
                ))}
                {
                    workingSpinner && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoadingSpinner size={30} color="#212121" />
                        </div>
                    )}
            </ul>
        </div>
    )
}