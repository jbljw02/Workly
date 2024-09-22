import { MenuItemProps } from "@/components/editor/child/MenuItem";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useRef, useState } from "react";
import UserIcon from '../../../../public/svgs/user.svg';
import LogoutIcon from '../../../../public/svgs/logout.svg';
import { useRouter } from "next/navigation";
import logout from "@/utils/logout";
import MenuList from "@/components/editor/child/MenuList";
import { useClickOutside } from "@/components/hooks/useClickOutside";

export default function UserSection() {
    const user = useAppSelector(state => state.user);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [menuListOpen, setMenuListOpen] = useState(false);

    const menuItems: MenuItemProps[] = [
        {
            Icon: UserIcon,
            IconWidth: "16",
            label: "회원 정보",
            onClick: () => console.log("A"),
        },
        {
            Icon: LogoutIcon,
            IconWidth: "16",
            label: "로그아웃",
            onClick: () => logout(router),
        },
    ];

    useClickOutside(containerRef, () => setMenuListOpen(false));

    return (
        <div
            ref={containerRef}
            onClick={() => setMenuListOpen(!menuListOpen)}
            className="flex flex-row items-center gap-3 mb-6 cursor-pointer" >
            <Image
                className="border rounded-3xl pt-[1px] select-none"
                src={user.photoURL ? user.photoURL : ''}
                alt={user.displayName || "User Profile"}
                width={37}
                height={37} />
            <div className="flex flex-col justify-start">
                <div className="text-sm truncate">{user.displayName}</div>
                <div className="pl-[1px] text-[11px] text-zinc-600">{user.email}</div>
            </div>
            {
                menuListOpen &&
                <MenuList
                    menuList={menuItems}
                    setListOpen={setMenuListOpen}
                    listPositon={{ top: '65px', left: '0px' }} />
            }
        </div >
    );
}