import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";

export default function ProfileSection() {
    const user = useAppSelector(state => state.user);
    return (
        <div className="flex flex-col items-center">
            <div className="relative group mb-4">
                <Image
                    src={user.photoURL === 'unknown-user' ? '/svgs/add-user.svg' : user.photoURL}
                    alt={user.displayName}
                    width={75}
                    height={75}
                    className="rounded-full" />
                {/* hover시에 변경 할 수 있음을 출력 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm">변경</span>
                </div>
            </div>
            <div className="text-[22px] font-semibold mb-1">{user.displayName}</div>
            <div className="text-[15px] text-zinc-500">{user.email}</div>
        </div>
    )
}