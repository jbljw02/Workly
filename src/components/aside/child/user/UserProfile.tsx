import { UserProps } from "@/types/user.type";
import Image from "next/image";
import useCheckDemo from "@/hooks/demo/useCheckDemo";

type UserProfileProps = {
    user: UserProps;
    isAlreadyCoworker?: boolean;
}

export default function UserProfile({ user }: UserProfileProps) {
    const checkDemo = useCheckDemo();

    if (!user) return null;
    return (
        <div className={`flex flex-row items-center gap-3 w-full 
            ${checkDemo() ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
                </div>
                <div className="pl-[1px] truncate text-[11px] text-zinc-600">{user.email}</div>
            </div>
        </div>
    )
}