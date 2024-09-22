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
import UserMenuList from "./UserMenuList";
import UserProfile from "./UserProfile";

export default function UserSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [menuListOpen, setMenuListOpen] = useState(false);

    useClickOutside(containerRef, () => setMenuListOpen(false));

    return (
        <div
            className="mb-6 w-full overflow-hidden"
            ref={containerRef}
            onClick={() => setMenuListOpen(!menuListOpen)}>
            <div className="cursor-pointer">
                <UserProfile />
            </div>
            {
                menuListOpen &&
                <UserMenuList setListOpen={setMenuListOpen} />
            }
        </div>
    );
}