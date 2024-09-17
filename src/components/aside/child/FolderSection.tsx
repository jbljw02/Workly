import SidebarItem from "./SidebarItem";
import FolderIcon from '../../../../public/svgs/folder.svg';
import PlusIcon from '../../../../public/svgs/add-folder.svg';
import { useState } from "react";
import AddInputModal from "@/components/modal/AddInputModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addFolders, Folder } from "@/redux/features/folderSlice";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from "firebase/firestore";
import fireStore from "../../../../firebase/firestore";

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
    const dispatch = useAppDispatch();

    const [addingFolder, setAddingFolder] = useState<boolean>(false);
    const [newFolderTitle, setNewFolderTitle] = useState<string>('');
    const [isDuplicatedInfo, setIsDuplicatedInfo] = useState({
        isInvalid: false,
        msg: '이미 존재하는 폴더명이에요',
    });

    const folders = useAppSelector(state => state.folders);

    const addNewFolder = async () => {
        const folderNameDuplicated = folders.find((folder: Folder) => folder.name === newFolderTitle);

        if (folderNameDuplicated) {
            setIsDuplicatedInfo((prevState) => ({
                ...prevState,
                isInvalid: true,
            }));
        }
        else {
            dispatch(addFolders({
                id: uuidv4(),
                name: newFolderTitle,
                documents: [],
                author: {
                    email: 'jbljw02@naver.com',
                    name: '이진우',
                },
                sharedWith: [],
            }));

            setIsDuplicatedInfo((prevState) => ({
                ...prevState,
                isInvalid: false,
            }));

            setAddingFolder(false);
            setNewFolderTitle('');
        }
    }

    const openModal = () => {
        setAddingFolder(true);
        setIsDuplicatedInfo((prevState) => ({
            ...prevState,
            isInvalid: false,
        }));
    }

    return (
        // Aside의 width에 따라 각각 다른 레이아웃 출력
        !isCollapsed ?
            <div className="mb-3">
                <div className="mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                <FolderItem folderName="이진우의 폴더" />
                {
                    folders.map((folder: Folder) => {
                        return (
                            <FolderItem folderName={folder.name} />
                        )
                    })
                }
                {/* 새 폴더를 추가하는 영역 */}
                <div
                    onClick={openModal}
                    className="flex items-center pl-2.5 h-7 rounded text-neutral-400 hover:bg-gray-100 cursor-pointer">
                    <PlusIcon width="16" />
                    <span
                        className="text-[13px] ml-2 whitespace-nowrap overflow-hidden">새 폴더</span>
                </div>
                <AddInputModal
                    isModalOpen={addingFolder}
                    setIsModalOpen={setAddingFolder}
                    title='새 폴더 만들기'
                    value={newFolderTitle}
                    setValue={setNewFolderTitle}
                    submitFunction={addNewFolder}
                    isInvalidInfo={isDuplicatedInfo}
                    placeholder="새 폴더의 이름을 입력해주세요" />

            </div> :
            <SidebarItem
                Icon={FolderIcon}
                IconWidth="16"
                label=""
                isCollapsed={isCollapsed} />
    )
}