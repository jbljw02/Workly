import { Folder, addFolders } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SetInvalidInfo } from "@/types/invalidInfoProps";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function useAddFolder() {
    const dispatch = useAppDispatch();

    const folders = useAppSelector(state => state.folders);
    const user = useAppSelector(state => state.user);

    // 새 폴더를 추가
    const addNewFolder = async (newFolderTitle: string, setIsFolderInvalidInfo: SetInvalidInfo) => {
        const folderNameDuplicated = folders.find((folder: Folder) => folder.name === newFolderTitle);

        if (folderNameDuplicated) {
            setIsFolderInvalidInfo(({
                msg: '이미 존재하는 폴더명입니다.',
                isInvalid: true,
            }));

            return true;
        }

        const addedFolder: Folder = {
            id: uuidv4(),
            name: newFolderTitle,
            documentIds: [],
            author: user,
            collaborators: [],
            createdAt: '',
            updatedAt: '',
        }

        try {
            // 폴더 추가 요청
            await axios.post('/api/folder',
                { folder: addedFolder });

            dispatch(addFolders(addedFolder));
            setIsFolderInvalidInfo({
                msg: '',
                isInvalid: false,
            });

            return false;
        } catch (error) {
            console.error("폴더 추가 실패: ", error);
            setIsFolderInvalidInfo(({
                msg: '폴더 추가에 실패했습니다.',
                isInvalid: true,
            }));

            return true;
        }
    }

    return addNewFolder;
}