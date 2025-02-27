import Modal from 'react-modal';
import ModalHeader from "./ModalHeader";
import { SearchCategory } from "../trash/Trash";
import WarningIcon from '../../../public/svgs/warning.svg';
import CommonButton from "../button/CommonButton";
import { DocumentProps } from "@/types/document.type";
import { Folder } from "@/types/folder.type";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trash/trashSlice";
import useOverlayLock from "@/hooks/common/useOverlayLock";
import { useEffect } from "react";
import { ModalProps } from '../../types/modalProps.type';
import useDeleteTrash from '@/hooks/trash/useDeleteTrash';

type DeleteCheckModalProps = ModalProps & {
    searchCategory: SearchCategory;
    trashItem: DocumentProps | Folder;
}

export default function DeleteCheckModal({ isModalOpen, setIsModalOpen, searchCategory, trashItem }: DeleteCheckModalProps) {
    const { deleteDocumentPermanently, deleteFolderPermanently } = useDeleteTrash(setIsModalOpen);

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
                deleteItemPermanently(trashItem);
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', keyPress);
        }

        return () => {
            window.removeEventListener('keydown', keyPress);
        };
    }, [isModalOpen, trashItem]);

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
                            width: 'w-14',
                            height: 'h-[38px]',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-red-500',
                            hover: 'hover:bg-red-600',
                            borderColor: 'border-red-500',
                        }}
                        label='삭제'
                        onClick={() => deleteItemPermanently(trashItem)} />
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