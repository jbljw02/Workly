import MenuItem, { MenuItemProps } from "@/components/menu/MenuItem";
import UserIcon from '../../../../../public/svgs/user.svg';
import LogoutIcon from '../../../../../public/svgs/logout.svg';
import logout from "@/utils/logout";
import HorizontalDivider from "@/components/editor/child/divider/HorizontalDivider";
import UserProfile from "./UserProfile";
import ContactIcon from '../../../../../public/svgs/contact.svg';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";

type UserMenuList = {
    menuListOpen: boolean;
    setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserMenuList({ menuListOpen, setListOpen }: UserMenuList) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(state => state.user);

    const menuItems: MenuItemProps[] = [
        {
            Icon: UserIcon,
            IconWidth: "18",
            label: "회원 정보",
            onClick: () => router.push('/editor/account'),
        },
        {
            Icon: ContactIcon,
            IconWidth: "16",
            label: "문의하기",
            onClick: () => router.push('/contact'),
        },
        {
            Icon: LogoutIcon,
            IconWidth: "15",
            label: "로그아웃",
            onClick: () => logout(router, dispatch),
            horizonLine: true,
        },
    ];

    return (
        <div className={`flex flex-col w-full overflow-hidden absolute bg-white border rounded border-neutral-300 pt-3.5 pb-1.5 z-10 top-[72px] left-4 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]
            transition-opacity duration-200 ease-in-out
            ${menuListOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="pb-2 pr-3 pl-3">
                <UserProfile user={user} />
            </div>
            <HorizontalDivider borderColor="border-gray-200" />
            <ul className="list-none text-sm m-0 p-0">
                {
                    menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {
                                item.horizonLine &&
                                <HorizontalDivider borderColor="border-gray-200" />
                            }
                            <MenuItem
                                Icon={item.Icon}
                                IconWidth={item.IconWidth}
                                label={item.label}
                                onClick={(e) => {
                                    item.onClick(e);
                                    setListOpen(false);
                                }} />
                        </React.Fragment>
                    ))
                }
            </ul>
        </div>
    )
}