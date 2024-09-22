import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";

export default function UserProfile() {
    const user = useAppSelector(state => state.user);

    return (
        <div className="flex flex-row items-center gap-3 w-full">
            <Image
                className="border rounded-3xl pt-[1px] select-none"
                src={user.photoURL ? user.photoURL : ''}
                alt={user.displayName || "User Profile"}
                width={37}
                height={37} />
            <div className="flex flex-col justify-start overflow-hidden w-full">
                <div className="text-sm truncate w-full">{user.displayName}</div>
                <div className="pl-[1px] truncate text-[11px] text-zinc-600">{user.email}</div>
            </div>
        </div>
    )
}