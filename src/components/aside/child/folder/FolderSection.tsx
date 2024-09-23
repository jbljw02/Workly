import SidebarItem from "../SidebarItem";
import FolderIcon from '../../../../../public/svgs/folder.svg';
import PlusIcon from '../../../../../public/svgs/add-folder.svg';
import { useCallback, useEffect, useRef, useState } from "react";
import AddInputModal from "@/components/modal/AddInputModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addFolders, Folder, setFolders } from "@/redux/features/folderSlice";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FolderItem from "./FolderItem";
import getUserFolder from "@/components/hooks/getUserFolder";

type FolderSectionProps = {
    isCollapsed: boolean;
}

export default function FolderSection({ isCollapsed }: FolderSectionProps) {
    const dispatch = useAppDispatch();

    const [addingFolder, setAddingFolder] = useState<boolean>(false);
    const [newFolderTitle, setNewFolderTitle] = useState<string>('');
    const [isDuplicatedInfo, setIsDuplicatedInfo] = useState({
        isInvalid: false,
        msg: '이미 존재하는 폴더명이에요',
    });

    const user = useAppSelector(state => state.user);
    const folders = useAppSelector(state => state.folders);

    // 폴더 추가
    const addNewFolder = async () => {
        const folderNameDuplicated = folders.find((folder: Folder) => folder.name === newFolderTitle);

        if (folderNameDuplicated) {
            setIsDuplicatedInfo((prevState) => ({
                ...prevState,
                isInvalid: true,
            }));
        }
        else {
            const addedFolder = {
                id: uuidv4(),
                name: newFolderTitle,
                documents: [],
                author: user,
                sharedWith: [],
            }

            dispatch(addFolders(addedFolder));

            setIsDuplicatedInfo((prevState) => ({
                ...prevState,
                isInvalid: false,
            }));

            setAddingFolder(false);
            setNewFolderTitle('');

            try {
                // 폴더 추가 요청
                await axios.post('/api/folder',
                    { email: user.email, folder: addedFolder },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });
                // 폴더가 추가됐으니 전체 업데이트
                await getUserFolder(user.email, dispatch);
            } catch (error) {
                console.error("폴더 추가 실패: ", error);
            }
        }
    }

    useEffect(() => {
        if (user.email) {
            getUserFolder(user.email, dispatch);
        }
    }, [user.email, getUserFolder]);

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
            <div className="w-full mb-3 overflow-hidden">
                <div className="mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                {
                    folders.length && folders.map((folder: Folder) => {
                        return (
                            <FolderItem folder={folder} />
                        )
                    })
                }
                {/* 새 폴더를 추가하는 영역 */}
                <div
                    onClick={openModal}
                    className="flex items-center pl-2.5 h-[30px] rounded text-neutral-400 hover:bg-gray-100 cursor-pointer">
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