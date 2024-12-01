import { useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import SidebarItem from "../aside/child/SidebarItem";
import TrashIcon from '../../../public/svgs/trash.svg';
import TrashContent from "./child/TrashContent";

export type SearchCategory = '폴더' | '문서';

export default function Trash({ isCollapsed }: { isCollapsed: boolean }) {
    const trashRef = useRef<HTMLDivElement>(null);
    const [isTrashOpen, setIsTrashOpen] = useState(false);

    useClickOutside(trashRef, () => setIsTrashOpen(false));

    return (
        <div ref={trashRef}>
            {/* 휴지통 */}
            <SidebarItem
                Icon={TrashIcon}
                IconWidth="19"
                label="휴지통"
                isCollapsed={isCollapsed}
                onClick={() => setIsTrashOpen(!isTrashOpen)} />
            {/* 휴지통 내용 */}
            {
                isTrashOpen && (
                    <TrashContent />
                )
            }
        </div>
    )
}