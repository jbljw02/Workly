import { useAppSelector } from "@/redux/hooks";
import GreenCircleIcon from '../../../../../public/svgs/green-circle.svg';
import Image from "next/image";
import HoverTooltip from "../../../tooltip/HoverTooltip";
import React from "react";
import { ConnectedUser } from "@/types/user.type";

type ConnectedUserItemProps = {
    user: ConnectedUser;
    index: number;
}

function ConnectedUserItem({ user, index }: ConnectedUserItemProps) {
    return (
        <div
            key={user.id}
            className={`flex items-center justify-center relative ${index !== 0 ? '-ml-1' : ''}`}>
            <HoverTooltip label={user.name}>
                <span className="w-[24px] h-[24px] overflow-hidden rounded-full flex-shrink-0">
                    <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover w-[24px] h-[24px]" />
                </span>
            </HoverTooltip>
        </div>
    );
}

export default function ConnectedUsers() {
    const connectedUsers = useAppSelector(state => state.connectedUsers);
    const connection = useAppSelector(state => state.connection);

    return (
        <div className="flex flex-row items-center justify-center gap-1.5 mr-1.5">
            {
                // 소켓 연결 성공 여부에 따라 분기
                connection ?
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-row items-center justify-center gap-1 pt-0.5">
                            <GreenCircleIcon
                                width="10"
                                className="pt-[3px] text-green-500" />
                            <div className="text-[11px] text-neutral-500">연결됨</div>
                        </div>
                        <div className="flex flex-row">
                            {
                                connectedUsers.map((user, index) => (
                                    <React.Fragment key={user.id}>
                                        <ConnectedUserItem
                                            user={user}
                                            index={index} />
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div> :
                    <div className="flex flex-row items-center justify-center gap-1 pt-0.5">
                        <GreenCircleIcon
                            width="10"
                            className="pt-[3px] text-red-400" />
                        <div className="text-[11px] text-red-400 font-semibold">연결 실패</div>
                    </div>
            }
        </div >
    );
}