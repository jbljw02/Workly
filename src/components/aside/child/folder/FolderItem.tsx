import FolderIcon from '../../../../../public/svgs/folder.svg';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addDocumentToFolder, addFolders, Folder, renameFolders, setFolders } from "@/redux/features/folderSlice";
import axios from 'axios';
import ArrowIcon from '../../../../../public/svgs/right-arrow.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import GroupHoverItem from '../GroupHoverItem';
import getUserFolder from '@/components/hooks/getUserFolder';
import { deleteFolders } from '@/redux/features/folderSlice';
import PlusIcon from '../../../../../public/svgs/plus.svg';
import HoverTooltip from '@/components/editor/child/HoverTooltip';
import DocumentSection from './DocumentSection';
import EditInput from './EditInput';
import { addDocuments, deleteDocuments, DocumentProps } from '@/redux/features/documentSlice';
import AddInputModal from '@/components/modal/AddInputModal';
import { setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import getUserDocument from '@/components/hooks/getUserDocument';

type FolderItemProps = {
    folder: Folder;
}

export default function FolderItem({ folder }: FolderItemProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const folders = useAppSelector(state => state.folders)

    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 폴더명 수정중
    const [isAdding, setIsAdding] = useState(false); // 폴더에 문서 추가중
    const [isExpanded, setIsExpanded] = useState(false); // 문서 영역을 확장 시켰는지

    const [folderTitle, setFolderTitle] = useState(folder.name);
    const [docTitle, setDocTitle] = useState('');

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
                getUserFolder(user.email, dispatch);
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
            getUserFolder(user.email, dispatch);
        } catch (error) {
            console.error(error);
            // 삭제에 실패하면 롤백
            dispatch(setFolders(prevFolders));
        }
    }

    // 선택된 폴더에 문서 추가
    const addDocToFolder = async () => {
        const newDocument: DocumentProps = {
            id: uuidv4(),
            title: docTitle,
            docContent: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: user,
            folderName: folder.name,
        }

        try {
            // 전체 문서 배열에 추가
            dispatch(addDocuments(newDocument));
            // 문서 ID를 기본 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: folder.id, document: newDocument.id }));

            // 문서를 배열에 추가
            dispatch(addDocuments(newDocument));
            
            await axios.post('/api/document',
                { email: user.email, folderId: folder.id, document: newDocument },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                });

            // 문서를 추가했으니 전체 배열 업데이트
            getUserDocument(user.email, dispatch);
            getUserFolder(user.email, dispatch);
        } catch (error) {
            console.error(error);
            dispatch(deleteDocuments(newDocument.id)); // 문서 추가 실패 시 롤백
        }
    }

    return (
        <div className='w-full'>
            {/* 각각의 폴더 영역 */}
            <div
                className="flex justify-between w-full pl-1.5 pr-1 h-[30px] rounded cursor-pointer hover:bg-gray-100 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <div className="flex flex-row items-center gap-1.5 overflow-hidden">
                    {/* 폴더 아이콘 */}
                    <div className="flex items-center justify-center flex-shrink-0 w-5">
                        {
                            // 수정 중일 때는 폴더 아이콘만 보여주고, 아니라면 hover 상태에 따라 제어
                            isEditing ?
                                <FolderIcon width="15" /> : (
                                    isHovered ?
                                        <div className='hover:bg-gray-200 rounded-sm transition-transform duration-300 '>
                                            {/* 화살표를 클릭 시 문서 */}
                                            <ArrowIcon
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className={`transition-transform duration-300 
                                                    ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                                                width="20" />
                                        </div> :
                                        <FolderIcon
                                            width="15" />
                                )
                        }
                    </div>
                    {/* 폴더의 제목 */}
                    <div className="text-sm truncate select-none">
                        {
                            isEditing ?
                                <EditInput
                                    title={folderTitle}
                                    setTitle={setFolderTitle}
                                    completeEdit={completeEdit}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing} />
                                :
                                folder.name
                        }
                    </div>
                </div>
                {/* 폴더에 적용할 수 있는 옵션들 */}
                <div className="flex flex-row items-center ml-1">
                    {
                        folder.name !== '내 폴더' &&
                        <>
                            <HoverTooltip label='폴더명 수정'>
                                <GroupHoverItem
                                    Icon={EditIcon}
                                    IconWidth={15}
                                    onClick={() => setIsEditing(true)} />
                            </HoverTooltip>
                            <HoverTooltip label='폴더 삭제'>
                                <GroupHoverItem
                                    Icon={DeleteIcon}
                                    IconWidth={15}
                                    onClick={deleteFolder} />
                            </HoverTooltip>
                            <HoverTooltip label='폴더에 문서 추가'>
                                <GroupHoverItem
                                    Icon={PlusIcon}
                                    IconWidth={15}
                                    onClick={() => setIsAdding(true)} />
                            </HoverTooltip>
                        </>
                    }
                </div>
            </div>
            {/* 확장 시 하위 문서들을 보여줌 */}
            {
                isExpanded &&
                <DocumentSection folder={folder} />
            }
            <AddInputModal
                isModalOpen={isAdding}
                setIsModalOpen={setIsAdding}
                title='폴더에 문서 추가하기'
                value={docTitle}
                setValue={setDocTitle}
                submitFunction={addDocToFolder}
                placeholder="추가할 문서의 이름을 입력해주세요" />
        </div>
    );
}