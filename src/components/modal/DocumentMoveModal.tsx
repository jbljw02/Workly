import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ModalProps } from "@/types/modalProps";
import Modal from 'react-modal';
import CommonInput from "../input/CommonInput";
import { useEffect, useState } from "react";
import FolderIcon from '../../../public/svgs/folder.svg';
import CommonButton from "../button/CommonButton";
import CloseIcon from '../../../public/svgs/close.svg';
import { Folder } from "@/redux/features/folderSlice";
import getUserDocument from "../hooks/getUserDocument";
import getUserFolder from "../hooks/getUserFolder";
import axios from 'axios';

export default function DocumentMoveModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const dispatch = useAppDispatch();

    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const folders = useAppSelector(state => state.folders);
    const user = useAppSelector(state => state.user);

    const [searchedFolders, setSearchedFolders] = useState<Folder[]>(folders);

    const [targetFolder, setTargetFolder] = useState('');
    const [vibrateFolderId, setVibrateFolderId] = useState<string | null>(null)

    const closeModal = () => {
        setTargetFolder('');
        setIsModalOpen(false);
    }

    // 문서 검색 필터링
    useEffect(() => {
        if (targetFolder) {
            const filteredFolders = folders.filter(folder =>
                folder.name.toLowerCase().includes(targetFolder.toLowerCase())
            )
            setSearchedFolders(filteredFolders);
        }
        else {
            setSearchedFolders(folders);
        }
    }, [targetFolder, folders]);

    // 문서의 폴더를 이동
    const moveDoc = async (folder: Folder) => {
        // 현재 폴더를 클릭하면 경고
        if (folder.name === selectedDocument.folderName) {
            setVibrateFolderId(folder.id); // 진동 효과를 적용할 폴더의 ID를 설정
            setTimeout(() => {
                setVibrateFolderId(null);
            }, 1000);
        }
        else {
            try {
                await axios.put('/api/document/move',
                    { email: user.email, folderId: folder.id, document: selectedDocument },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });

                // 문서를 추가했으니 전체 배열 업데이트
                await getUserDocument(user.email, dispatch);
                await getUserFolder(user.email, dispatch);

                setIsModalOpen(false);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 510,
                    height: 390,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                    padding: 25,
                }
            }}>
            <div className='flex flex-col h-full justify-between'>
                <div>
                    <div className='mb-4 text-lg'>
                        <span className="font-semibold">{selectedDocument.title}</span>
                        를 어디로 옮길까요?
                    </div>
                    <button
                        onClick={closeModal}
                        className="absolute top-5 right-5">
                        <CloseIcon
                            className="hover:text-gray-500"
                            width="18" />
                    </button>
                    <CommonInput
                        type="text"
                        value={targetFolder}
                        setValue={setTargetFolder}
                        placeholder="문서를 옮길 폴더 검색"
                        autoFocus={true} />
                    <div className="mt-5 mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                    {
                        searchedFolders.length ?
                            <div className="w-full max-h-52 overflow-y-scroll scrollbar-thin">
                                {
                                    searchedFolders.map(folder => {
                                        return (
                                            <div
                                                key={folder.id}
                                                onClick={() => moveDoc(folder)}
                                                className="flex flex-row justify-between items-center w-full pl-2 h-[30px] rounded-sm overflow-x-hidden cursor-pointer hover:bg-gray-100 group">
                                                <div className={`flex flex-row items-center gap-1.5 
                                                    ${vibrateFolderId === folder.id ? 'vibrate text-red-500' : ''}`}>
                                                    <FolderIcon width="15" />
                                                    <div className="text-sm truncate select-none">{folder.name}</div>
                                                </div>
                                                <div className={`text-[12px] pr-3 text-neutral-500 select-none
                                                    ${vibrateFolderId === folder.id ? 'vibrate text-red-500' : ''}`}>
                                                    {
                                                        selectedDocument.folderName === folder.name && '현재 폴더'
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div className="flex justify-center items-center text-neutral-400 w-full h-full text-sm pl-2">검색 결과 없음</div>
                    }
                </div>
            </div>
        </Modal >
    )
}