import { ModalProps } from "@/types/modalProps";
import Modal from 'react-modal';
import ModalHeader from "./ModalHeader";
import { SearchCategory } from "../trash/Trash";
import WarningIcon from '../../../public/svgs/warning.svg';
import CommonButton from "../button/CommonButton";
import { DocumentProps } from "@/redux/features/documentSlice";
import { Folder } from "@/redux/features/folderSlice";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trashSlice";
import useDeleteTrash from "../hooks/useDeleteTrash";
import useOverlayLock from "../hooks/useOverlayLock";
import { useEffect } from "react";

type DeleteCheckModalProps = ModalProps & {
    searchCategory: SearchCategory;
    item: DocumentProps | Folder;
}

export default function DeleteCheckModal({ isModalOpen, setIsModalOpen, searchCategory, item }: DeleteCheckModalProps) {
    const dispatch = useAppDispatch();
    console.log('item: ', item);

    const { deleteTrashDocument, deleteTrashFolder } = useDeleteTrash();

    const user = useAppSelector(state => state.user);
    const documentsTrash = useAppSelector(state => state.documentsTrash);
    const foldersTrash = useAppSelector(state => state.foldersTrash);

    // 문서를 영구 삭제
    const deleteDocumentPermanently = async (document: DocumentProps) => {
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];

        try {
            // 휴지통에서 문서를 삭제하고 폴더에서 참조 제거
            deleteTrashDocument(document);

            setIsModalOpen(false);

            // tiptap cloud 서버에서 문서 삭제
            await axios.delete('/api/tiptap-document', {
                params: { docName: document.id }
            });

            // 파이어베이스에서 문서 삭제
            await axios.delete('/api/trash/document', {
                params: {
                    docId: document.id,
                    folderId: document.folderId,
                }
            });

            dispatch(showCompleteAlert('해당 문서는 영구적으로 삭제되었습니다.'));
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('삭제에 실패했습니다.'));

            // 삭제 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
        }
    }

    // 폴더를 영구 삭제
    const deleteFolderPermanently = async (folder: Folder) => {
        console.log("folder: ", folder);
        const prevDocumentsTrash = [...documentsTrash];
        const prevFoldersTrash = [...foldersTrash];

        try {
            // 휴지통에서 폴더를 삭제하고 참조 중인 모든 문서 제거
            deleteTrashFolder(folder);

            setIsModalOpen(false);

            // 폴더 내 모든 문서를 클라우드에서 삭제(병렬 처리)
            await Promise.all(
                folder.documentIds.map(id =>
                    axios.delete('/api/tiptap-document', {
                        params: { docName: id }
                    })
                )
            );

            // 파이어베이스에서 폴더 삭제
            await axios.delete('/api/trash/folder', {
                params: {
                    email: user.email,
                    folderId: folder.id,
                }
            });

            dispatch(showCompleteAlert('해당 폴더는 영구적으로 삭제되었습니다.'));
        } catch (error) {
            dispatch(showWarningAlert('삭제에 실패했습니다.'));

            // 삭제 실패 시 롤백
            dispatch(setDocumentsTrash(prevDocumentsTrash));
            dispatch(setFoldersTrash(prevFoldersTrash));
        }
    }

    // 삭제할 아이템이 문서인지 폴더인지 확인하고 작업을 분기
    const deleteItemPermanently = (item: DocumentProps | Folder) => {
        if (searchCategory === '문서') {
            deleteDocumentPermanently(item as DocumentProps);
        }
        else {
            deleteFolderPermanently(item as Folder);
        }
    }

    // 엔터키를 누를 시 삭제 작업 수행
    useEffect(() => {
        const keyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                deleteItemPermanently(item);
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', keyPress);
        }

        return () => {
            window.removeEventListener('keydown', keyPress);
        };
    }, [isModalOpen, item]);

    useOverlayLock(isModalOpen);

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
                    width: 500,
                    height: 240,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                }
            }}>
            <div className="flex flex-col h-full justify-between">
                <div>
                    <ModalHeader
                        label={<div className='font-semibold'>{searchCategory} 삭제</div>}
                        closeModal={() => setIsModalOpen(false)} />
                    <div className="flex flex-col px-6 gap-4 mt-1.5">
                        <div className="text-[15px]">해당 {searchCategory}를 정말로 삭제하시겠습니까?</div>
                        <div className="flex flex-row items-center gap-2 bg-red-100 rounded px-4 py-3">
                            <WarningIcon width="23" />
                            <div className="text-sm text-red-500">이 작업은 되돌릴 수 없으며, 영구적으로 삭제됩니다.</div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end text-sm gap-3.5 px-6 pb-6'>
                    <CommonButton
                        style={{
                            width: 'w-16',
                            height: 'h-[38px]',
                            textSize: 'text-white',
                            textColor: 'text-gray-500',
                            bgColor: 'bg-red-500',
                            hover: 'hover:bg-red-600',
                        }}
                        label='삭제'
                        onClick={() => deleteItemPermanently(item)} />
                    <CommonButton
                        style={{
                            width: 'w-14',
                            height: 'h-[38px]',
                            textSize: 'text-sm',
                            textColor: 'text-gray-500',
                            bgColor: 'bg-transparent',
                            hover: 'hover:border-gray-600',
                        }}
                        label='취소'
                        onClick={() => setIsModalOpen(false)} />
                </div>
            </div>
        </Modal>
    )
}