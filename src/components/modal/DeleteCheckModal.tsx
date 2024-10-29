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
import { deleteDocumentsFromTrash, deleteFoldersFromTrash, setDocumentsTrash, setFoldersTrash } from "@/redux/features/trashSlice";

type DeleteCheckModalProps = ModalProps & {
    searchCategory: SearchCategory;
    item: DocumentProps | Folder;
    trashList: DocumentProps[] | Folder[];
}

export default function DeleteCheckModal({
    isModalOpen,
    setIsModalOpen,
    searchCategory,
    item,
    trashList }: DeleteCheckModalProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    // 휴지통에 있는 아이템 영구 삭제
    // 삭제할 아이템이 문서인지 폴더인지에 따라서 작업 분기
    const deleteItemPermanently = async (item: DocumentProps | Folder) => {
        const prevTrashList = [...trashList];
        try {
            // 휴지통에서 문서, 폴더 삭제
            if (searchCategory === '문서') {
                dispatch(deleteDocumentsFromTrash(item.id));
            }
            else {
                dispatch(deleteFoldersFromTrash(item.id));
            }

            setIsModalOpen(false);

            await axios.delete(`/api/trash/${searchCategory === '문서' ? 'document' : 'folder'}`, {
                params: (
                    searchCategory === '문서' ?
                        {
                            email: user.email,
                            docId: item.id,
                            folderId: (item as DocumentProps).folderId,
                        } :
                        {
                            email: user.email,
                            folderId: item.id,
                        }
                )
            })

            if (searchCategory === '문서') {
                dispatch(showCompleteAlert('해당 문서는 영구적으로 삭제되었습니다.'));
            }
            else {
                dispatch(showCompleteAlert('해당 폴더는 영구적으로 삭제되었습니다.'));
            }
        } catch (error) {
            console.log(error);
            dispatch(showWarningAlert('삭제에 실패했습니다.'));

            // 삭제 실패 시 롤백
            if (searchCategory === '문서') {
                dispatch(setDocumentsTrash(prevTrashList));
            }
            else {
                dispatch(setFoldersTrash(prevTrashList));
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
                    width: 500,
                    height: 240,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
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
                            px: 'px-3.5',
                            py: 'py-2',
                            textSize: 'text-white',
                            textColor: 'text-gray-500',
                            bgColor: 'bg-red-500',
                            hover: 'hover:bg-red-600',
                        }}
                        label='삭제'
                        onClick={() => deleteItemPermanently(item)} />
                    <CommonButton
                        style={{
                            px: 'px-3.5',
                            py: 'py-2',
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

function removeDocumentFromFolderTrash(arg0: { folderId: string; docId: string; }): any {
    throw new Error("Function not implemented.");
}
