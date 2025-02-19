import { useAppSelector } from "@/redux/hooks";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import UserMenuList from "./UserMenuList";
import UserProfile from "./UserProfile";
import UserProfileSkeleton from "@/components/placeholder/skeleton/UserProfileSkeleton";

export default function UserSection() {
    const user = useAppSelector(state => state.user);
    const containerRef = useRef<HTMLDivElement>(null);

    const [menuListOpen, setMenuListOpen] = useState(false);

    useClickOutside(containerRef, () => setMenuListOpen(false));

    return (
        <div
            className="mb-6 w-full overflow-hidden z-20"
            ref={containerRef}
            onClick={() => setMenuListOpen(!menuListOpen)}>
            {
                !user.displayName || !user.email ?
                    <UserProfileSkeleton /> :
                    <>
                        <div className="cursor-pointer">
                            <UserProfile user={user} />
                        </div>
                        <UserMenuList
                            menuListOpen={menuListOpen}
                            setListOpen={setMenuListOpen} />
                    </>
            }
        </div>
    );
}