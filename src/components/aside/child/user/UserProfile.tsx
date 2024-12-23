import { UserProps } from "@/redux/features/userSlice";
import Image from "next/image";

type UserProfileProps = {
    user: UserProps;
    isAlreadyCoworker?: boolean;
}

export default function UserProfile({ user, isAlreadyCoworker }: UserProfileProps) {
    if (!user) return null;
    return (
        <div className="flex flex-row items-center gap-3 w-full">
            {/* 구글 계정 회원이라면 구글 이미지를 보여줌 */}
            {/* 구글 계정 회원이 아니라면 기본 이미지를 보여줌 */}
            {/* 사용자의 협업자로 등록돼있지 않다면 유저 추가 아이콘을 보여줌 */}
            <div className="w-[37px] h-[37px] rounded-full overflow-hidden flex-shrink-0">
                <Image
                    src={user.photoURL === 'unknown-user' ? '/svgs/add-user.svg' : user.photoURL}
                    alt={user.displayName}
                    width={37}
                    height={37}
                    className="rounded-full object-cover w-[37px] h-[37px]" />
            </div>
            <div className="flex flex-col justify-start overflow-hidden w-full">
                <div className="flex flex-row items-center gap-1 w-full">
                    <div className="text-sm truncate">{user.displayName}</div>
                    {
                        isAlreadyCoworker &&
                        <div className="text-[11px] text-neutral-400">멤버</div>
                    }
                </div>
                <div className="pl-[1px] truncate text-[11px] text-zinc-600">{user.email}</div>
            </div>
        </div>
    )
}