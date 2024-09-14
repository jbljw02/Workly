import SidebarItem from "./SidebarItem";
import FolderIcon from '../../../../public/svgs/folder.svg';
import PlusIcon from '../../../../public/svgs/add-folder.svg';
import { useState } from "react";
import AddNoticeModal from "@/components/modal/AddNoticeModal";

type FolderSectionProps = {
    isCollapsed: boolean;
}

type FolderItemProps = {
    folderName: string;
}

function FolderItem({ folderName }: FolderItemProps) {
    return (
        <div className="flex items-center pl-2.5 pr-1.5 w-full h-7 rounded cursor-pointer hover:bg-gray-100 group">
            <FolderIcon width="16" />
            <div className="ml-2.5 text-sm whitespace-nowrap overflow-hidden">
                {folderName}
            </div>
        </div>
    )
}

export default function FolderSection({ isCollapsed }: FolderSectionProps) {
    const [addFolder, setAddFolder] = useState<boolean>(false);
    const [newFolderTitle, setNewFolderTitle] = useState<string>('');

    return (
        !isCollapsed ?
            <div className="mb-3">
                <div className="mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                <FolderItem folderName="이진우의 폴더" />
                {/* 새 폴더를 추가하는 영역 */}
                <div
                    onClick={() => setAddFolder(true)}
                    className="flex items-center pl-2.5 h-7 rounded text-neutral-400 hover:bg-gray-100 cursor-pointer">
                    <PlusIcon width="16" />
                    <span
                        className="text-[13px] ml-2 whitespace-nowrap overflow-hidden">새 폴더</span>
                </div>
                <AddNoticeModal
                    isModalOpen={addFolder}
                    setIsModalOpen={setAddFolder}
                    title='새 폴더 만들기'
                    value={newFolderTitle}
                    setValue={setNewFolderTitle}
                    placeholder="새 폴더의 이름을 입력해주세요" />

            </div> :
            <SidebarItem
                Icon={FolderIcon}
                IconWidth="16"
                label=""
                isCollapsed={isCollapsed} />
    )
}