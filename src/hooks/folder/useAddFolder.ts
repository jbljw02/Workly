import { addFolders } from "@/redux/features/folder/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SetInvalidInfo } from "@/types/invalidInfoProps.type";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Folder } from "@/types/folder.type";
import useCheckDemo from "../demo/useCheckDemo";

export default function useAddFolder() {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

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
            readedAt: '',
        }

        try {
            if (!checkDemo()) {
                await axios.post('/api/folder',
                    { folder: addedFolder });
            }

            dispatch(addFolders(addedFolder));
            setIsFolderInvalidInfo({
                msg: '',
                isInvalid: false,
            });

            return false;
        } catch (error) {
            setIsFolderInvalidInfo(({
                msg: '폴더 추가에 실패했습니다.',
                isInvalid: true,
            }));

            return true;
        }
    }

    return addNewFolder;
}