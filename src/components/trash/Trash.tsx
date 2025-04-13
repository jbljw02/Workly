import { useRef, useState } from "react";
import SidebarItem from "../aside/child/SidebarItem";
import TrashIcon from '../../../public/svgs/trash.svg';
import TrashContent from "./child/TrashContent";
import useGetTrash from "@/hooks/trash/useGetTrash";

export default function Trash({ isCollapsed }: { isCollapsed: boolean }) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isTrashOpen, setIsTrashOpen] = useState(false);

    useGetTrash();
    return (
        <>
            <div ref={sidebarRef}>
                {/* 휴지통 토글 버튼 */}
                <SidebarItem
                    Icon={TrashIcon}
                    IconWidth="19"
                    label="휴지통"
                    isCollapsed={isCollapsed}
                    onClick={() => setIsTrashOpen(!isTrashOpen)} />
            </div>
            {/* 휴지통 내용 */}
            {
                isTrashOpen && (
                    <TrashContent
                        parentRef={sidebarRef}
                        setIsTrashOpen={setIsTrashOpen} />
                )
            }
        </>
    )
}