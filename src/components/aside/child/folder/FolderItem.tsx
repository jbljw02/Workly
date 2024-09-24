import FolderIcon from '../../../../../public/svgs/folder.svg';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addFolders, Folder, renameFolders, setFolders } from "@/redux/features/folderSlice";
import axios from 'axios';
import ArrowIcon from '../../../../../public/svgs/right-arrow.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import GroupHoverItem from '../GroupHoverItem';
import getUserFolder from '@/components/hooks/getUserFolder';
import { deleteFolders } from '@/redux/features/folderSlice';

type FolderItemProps = {
    folder: Folder;
}

export default function FolderItem({ folder }: FolderItemProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const folders = useAppSelector(state => state.folders)

    const [isHovered, setIsHovered] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [folderTitle, setFolderTitle] = useState(folder.name);

    const completeEdit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터키가 클릭될 시, 작업을 종료하고 폴더명 수정 요청 전송
        if (e.key === 'Enter') {
            const prevFolder = folder; // 변경 이전 폴더 상태

            dispatch(renameFolders({ folderId: folder.id, newName: folderTitle }));
            setIsEditing(false);

            // 폴더명 수정 요청
            try {
                await axios.put('/api/folder',
                    { email: user.email, folderId: folder.id, newFolderName: folderTitle },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });

                // 폴더가 수정됐으니 전체 배열 업데이트
                await getUserFolder(user.email, dispatch);
            } catch (error) {
                console.error(error);

                // 변경에 실패할 경우 폴더명을 이전 상태로 롤백
                setFolderTitle(prevFolder.name);
                dispatch(renameFolders({ folderId: prevFolder.id, newName: prevFolder.name }));
            }
        }
        // ESC 키가 클릭될 시, 작업을 종료
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }

    // 폴더 삭제 요청
    const deleteFolder = async () => {
        // const prevFolder = folder; // 변경 이전 폴더 상태
        const prevFolders = [...folders];

        dispatch(deleteFolders(folder.id))

        try {
            await axios.delete('/api/folder', {
                params: {
                    email: user.email,
                    folderId: folder.id,
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            // 폴더가 삭제됐으니 전체 배열 업데이트
            await getUserFolder(user.email, dispatch);
        } catch (error) {
            console.error(error);
            // 삭제에 실패하면 롤백
            dispatch(setFolders(prevFolders));
        }
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    return (
        <div
            className="flex justify-between pl-1.5 pr-1 w-full h-[30px] rounded cursor-pointer hover:bg-gray-100 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className="flex flex-row items-center overflow-hidden">
                <div className="flex items-center justify-center flex-shrink-0 w-5">
                    {
                        // 수정 중일 때는 폴더 아이콘만 보여주고, 아니라면 hover 상태에 따라 제어
                        isEditing ?
                            <FolderIcon width="15" /> : (
                                isHovered ?
                                    <ArrowIcon
                                        className="hover:bg-gray-200 rounded-sm"
                                        width="20" /> :
                                    <FolderIcon
                                        width="15" />
                            )
                    }
                </div>
                <div className="ml-1.5 text-sm truncate select-none">
                    {
                        isEditing ?
                            <input
                                ref={inputRef}
                                type="text"
                                value={folderTitle}
                                onChange={(e) => setFolderTitle(e.target.value)}
                                onKeyDown={completeEdit}
                                className="text-sm truncate bg-transparent outline-none"
                                autoFocus
                                onBlur={() => setIsEditing(false)} /> :
                            folder.name
                    }
                </div>
            </div>
            <div className="flex flex-row ml-1">
                {
                    folder.name !== '내 폴더' &&
                    <>
                        <GroupHoverItem
                            Icon={EditIcon}
                            IconWidth={15}
                            onClick={() => setIsEditing(true)} />
                        <GroupHoverItem
                            Icon={DeleteIcon}
                            IconWidth={15}
                            onClick={deleteFolder} />
                    </>
                }
            </div>
        </div>
    );
}