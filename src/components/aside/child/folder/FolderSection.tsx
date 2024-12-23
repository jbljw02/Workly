import SidebarItem from "../SidebarItem";
import FolderIcon from '../../../../../public/svgs/folder.svg';
import PlusIcon from '../../../../../public/svgs/add-folder.svg';
import { useState } from "react";
import AddInputModal from "@/components/modal/AddInputModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FolderItem from "./FolderItem";
import useAddFolder from "@/components/hooks/useAddFolder";
import AsideContentSkeleton from "@/components/placeholder/skeleton/AsideContentSkeleton";

type FolderSectionProps = {
    isCollapsed: boolean;
}

export default function FolderSection({ isCollapsed }: FolderSectionProps) {
    const addNewFolder = useAddFolder();

    const folders = useAppSelector(state => state.folders);
    const documents = useAppSelector(state => state.documents);
    const isFolderLoading = useAppSelector(state => state.loading.isFolderLoading);
    const isDocumentLoading = useAppSelector(state => state.loading.isDocumentLoading);

    const [addingFolder, setAddingFolder] = useState<boolean>(false);
    const [newFolderTitle, setNewFolderTitle] = useState<string>('');
    const [isFolderInvalidInfo, setIsFolderInvalidInfo] = useState({
        isInvalid: false,
        msg: '',
    });

    return (
        // Aside의 width에 따라 각각 다른 레이아웃 출력
        !isCollapsed ?
            <div className="w-full max-h-[520px] overflow-y-auto mb-3 scrollbar-thin">
                {
                    (isFolderLoading || isDocumentLoading) && (folders.length === 0 || documents.length === 0) ?
                        <AsideContentSkeleton /> :
                        <>
                            <div className="mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                            {
                                folders.length > 0 &&
                                folders.map(folder => {
                                    return (
                                        <div key={folder.id}>
                                            <FolderItem folder={folder} />
                                        </div>
                                    )
                                })
                            }
                            {/* 새 폴더를 추가하는 영역 */}
                            <div
                                onClick={() => setAddingFolder(true)}
                                className="flex items-center pl-2 h-[30px] rounded text-neutral-400 hover:bg-gray-100 cursor-pointer">
                                <PlusIcon width="16" />
                                <span
                                    className="text-[13px] ml-2 whitespace-nowrap overflow-hidden select-none">새 폴더</span>
                            </div>
                            <AddInputModal
                                isModalOpen={addingFolder}
                                setIsModalOpen={setAddingFolder}
                                value={newFolderTitle}
                                setValue={setNewFolderTitle}
                                submitFunction={() => addNewFolder(newFolderTitle, setIsFolderInvalidInfo)}
                                category='folder'
                                isInvalidInfo={isFolderInvalidInfo}
                                setIsInvalidInfo={setIsFolderInvalidInfo} />
                        </>
                }
            </div> :
            <SidebarItem
                Icon={FolderIcon}
                IconWidth="16"
                label=""
                isCollapsed={isCollapsed} />
    )
}