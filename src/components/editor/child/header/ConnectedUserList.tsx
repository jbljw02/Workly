import { useAppSelector } from "@/redux/hooks";
import GreenCircleIcon from '../../../../../public/svgs/green-circle.svg';
import Image from "next/image";
import HoverTooltip from "../menu-bar/HoverTooltip";
import { ConnectedUser } from "@/redux/features/shareDocumentSlice";
import React from "react";

type ConnectedUserItemProps = {
    user: ConnectedUser;
    index: number;
}

function ConnectedUserItem({ user, index }: ConnectedUserItemProps) {
    return (
        <div
            key={user.id}
            className={`relative ${index !== 0 ? '-ml-1' : ''}`}>
            <HoverTooltip label={user.name}>
                <Image
                    src={user.photoURL}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="rounded-full" />
            </HoverTooltip>
        </div>
    );
}

export default function ConnectedUsers() {
    const connectedUsers = useAppSelector(state => state.connectedUsers);
    return (
        <div className="flex flex-row items-center justify-center gap-1.5 mr-1.5">
            <div className="flex items-center justify-center pt-0.5 gap-1">
                <GreenCircleIcon
                    width="10"
                    className="pt-0.5" />
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
        </div>
    );
}