import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ModalProps } from "@/types/modalProps";
import Modal from 'react-modal';
import CommonInput from "../input/CommonInput";
import { useEffect, useState } from "react";
import FolderIcon from '../../../public/svgs/folder.svg';
import CloseIcon from '../../../public/svgs/close.svg';
import { addDocumentToFolder, Folder, removeDocumentFromFolder } from "@/redux/features/folderSlice";
import axios from 'axios';
import { DocumentProps, updateDocuments } from "@/redux/features/documentSlice";
import ModalHeader from "./ModalHeader";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { WorkingDocModalProps } from "@/types/workingDocModalProps";
import useOverlayLock from "../hooks/useOverlayLock";

export default function DocumentMoveModal({ isModalOpen, setIsModalOpen, selectedDoc }: WorkingDocModalProps) {
    const dispatch = useAppDispatch();

    const folders = useAppSelector(state => state.folders);

    // 검색을 통해 필터링 된 폴더들
    const [searchedFolders, setSearchedFolders] = useState<Folder[]>(folders);
    const [targetFolder, setTargetFolder] = useState(''); // 검색 input값
    // 어떤 폴더에 진동 효과를 줄지 
    const [vibrateFolderId, setVibrateFolderId] = useState<string | null>(null);

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
    const moveDoc = async (targetFolder: Folder) => {
        // 현재 폴더를 클릭하면 경고
        if (targetFolder.id === selectedDoc.folderId) {
            setVibrateFolderId(targetFolder.id); // 진동 효과를 적용할 폴더의 ID를 설정
            setTimeout(() => {
                setVibrateFolderId(null);
            }, 1000);
        }
        else {
            // 나머지 값은 유지하고, 폴더 이름과 ID만 변경
            const newDoc: DocumentProps = {
                ...selectedDoc,
                folderName: targetFolder.name,
                folderId: targetFolder.id,
            }

            try {
                await axios.put('/api/document/move',
                    {
                        folderId: targetFolder.id,
                        document: selectedDoc
                    });

                // 전체 문서중에 변경할 문서의 폴더 이름을 변경
                dispatch(updateDocuments({ docId: selectedDoc.id, ...newDoc }));

                // 기존 폴더에서 문서 ID를 삭제하고, 새 폴더에 문서 ID를 추가
                dispatch(removeDocumentFromFolder({ folderId: selectedDoc.folderId, docId: newDoc.id }));
                dispatch(addDocumentToFolder({ folderId: targetFolder.id, docId: newDoc.id }));

                // 문서 이동이 성공했다는 Alert를 띄우고 모달 닫기
                dispatch(showCompleteAlert(`${selectedDoc.title || '제목 없는 문서'}를 ${targetFolder.name}로 옮겼습니다.`))
                setIsModalOpen(false);
            } catch (error) {
                console.error(error);
                dispatch(showWarningAlert(`${selectedDoc.title}를 이동하는 데에 실패했습니다.`))
            }
        }
    }
    
    useOverlayLock(isModalOpen);

    if (!selectedDoc) return null;

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 500,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 510,
                    maxHeight: '80vh',
                    minHeight: 330,
                    height: 'fit-content',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                }
            }}>
            <div className='flex flex-col h-full'>
                <ModalHeader
                    label={<div className="font-normal text-[17px]"><b>{selectedDoc.title || '제목 없는 문서'}</b>를 어디로 옮길까요?</div>}
                    closeModal={closeModal} />
                <div className="flex flex-col px-6">
                    <div className='text-sm mt-2 mb-2 pl-0.5'>폴더</div>
                    <CommonInput
                        style={{
                            px: 'px-3',
                            py: 'py-2',
                            textSize: 'text-[15px]',
                        }}
                        type="text"
                        value={targetFolder}
                        setValue={setTargetFolder}
                        placeholder="문서를 옮길 폴더 검색"
                        autoFocus={true} />
                </div>
                <div className="pl-6 pr-5 pb-6">
                    <div className="mt-5 pb-1.5 pl-1.5 text-[13px] font-semibold">폴더 목록</div>
                    {
                        searchedFolders.length ?
                            <div className="w-full max-h-52 overflow-y-scroll scrollbar-thin">
                                {
                                    searchedFolders.map(folder => {
                                        return (
                                            <div
                                                key={folder.id}
                                                onClick={() => moveDoc(folder)}
                                                className="flex flex-row justify-between items-center w-full pl-2 h-[30px] rounded-[4px] overflow-x-hidden cursor-pointer hover:bg-gray-100 group">
                                                <div className={`flex flex-row items-center gap-1.5 
                                                    ${vibrateFolderId === folder.id ? 'vibrate text-red-500' : ''}`}>
                                                    <FolderIcon width="15" />
                                                    <div className="text-sm truncate select-none">{folder.name}</div>
                                                </div>
                                                <div className={`text-[12px] pr-3 text-neutral-500 select-none
                                                    ${vibrateFolderId === folder.id ? 'vibrate text-red-500' : ''}`}>
                                                    {
                                                        selectedDoc.folderId === folder.id && '현재 폴더'
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div className="flex justify-center items-center text-neutral-400 w-full h-full text-sm pt-7">검색 결과 없음</div>
                    }
                </div>
            </div>
        </Modal>
    )
}