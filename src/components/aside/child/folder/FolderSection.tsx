import SidebarItem from "../SidebarItem";
import FolderIcon from '../../../../../public/svgs/folder.svg';
import PlusIcon from '../../../../../public/svgs/add-folder.svg';
import { useCallback, useEffect, useState } from "react";
import AddInputModal from "@/components/modal/AddInputModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FolderItem from "./FolderItem";
import getUserFolder from "@/components/hooks/getUserFolder";
import getUserDocument from "@/components/hooks/getUserDocument";
import { AppDispatch } from "@/redux/store";
import useAddFolder from "@/components/hooks/useAddFolder";

type FolderSectionProps = {
    isCollapsed: boolean;
}

export default function FolderSection({ isCollapsed }: FolderSectionProps) {
    const dispatch = useAppDispatch();

    const [addingFolder, setAddingFolder] = useState<boolean>(false);
    const [newFolderTitle, setNewFolderTitle] = useState<string>('');
    const [isFolderInvalidInfo, setIsFolderInvalidInfo] = useState({
        isInvalid: false,
        msg: '',
    });

    const addNewFolder = useAddFolder();

    const user = useAppSelector(state => state.user);
    const folders = useAppSelector(state => state.folders);

    const getUserData = useCallback(async (email: string, dispatch: AppDispatch) => {
        if (email) {
            await getUserFolder(email, dispatch);
            await getUserDocument(email, dispatch);
        }
    }, [user.email, dispatch]);

    useEffect(() => {
        getUserData(user.email, dispatch);
    }, [getUserData]);

    return (
        // Aside의 width에 따라 각각 다른 레이아웃 출력
        !isCollapsed ?
            <div className="w-full mb-3">
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
                    title='새 폴더 만들기'
                    value={newFolderTitle}
                    setValue={setNewFolderTitle}
                    submitFunction={() => addNewFolder(newFolderTitle, setIsFolderInvalidInfo)}
                    isInvalidInfo={isFolderInvalidInfo}
                    setIsInvalidInfo={setIsFolderInvalidInfo}
                    placeholder="새 폴더의 이름을 입력해주세요" />
            </div> :
            <SidebarItem
                Icon={FolderIcon}
                IconWidth="16"
                label=""
                isCollapsed={isCollapsed} />
    )
}