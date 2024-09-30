import { useAppSelector } from "@/redux/hooks";
import { ModalProps } from "@/types/modalProps";
import Modal from 'react-modal';
import CommonInput from "../input/CommonInput";
import { useState } from "react";
import FolderIcon from '../../../public/svgs/folder.svg';
import CommonButton from "../button/CommonButton";
import CloseIcon from '../../../public/svgs/close.svg';
import { Folder } from "@/redux/features/folderSlice";

interface DocumentMoveModalProps extends ModalProps {

}

export default function DocumentMoveModal({ isModalOpen, setIsModalOpen }: DocumentMoveModalProps) {
    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const folders = useAppSelector(state => state.folders);
    const searchedFolders = useState<Folder[]>(folders.map(folder => folder));

    const [targetFolder, setTargetFolder] = useState('');

    const closeModal = () => {
        setTargetFolder('');
        setIsModalOpen(false);
    }
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
                    zIndex: 1000,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 510,
                    height: 395,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                    padding: 25,
                }
            }}>
            <div className='flex flex-col h-full justify-between'>
                <div>

                    <div className='mb-4'>
                        <span className="font-semibold">{selectedDocument.title}</span>
                        를 어디로 옮길까요?
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-6 right-6">
                        <CloseIcon
                            className="hover:text-gray-500"
                            width="21" />
                    </button>
                    <CommonInput
                        type="text"
                        value={targetFolder}
                        setValue={setTargetFolder}
                        placeholder="문서를 옮길 폴더 선택"
                        autoFocus={true} />
                    <div className="mt-5 mb-1.5 ml-2 text-[13px] font-semibold">폴더</div>
                    <div className="w-full max-h-52 overflow-y-scroll scrollbar-thin">
                        {
                            folders.map(folder => {
                                return (
                                    <div
                                        key={folder.id}
                                        className="flex flex-row items-center pl-2 w-full h-[30px] rounded-sm gap-1.5 overflow-x-hidden cursor-pointer hover:bg-gray-100 group">
                                        <FolderIcon width="15" />
                                        <div className="text-sm truncate select-none">{folder.name}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {/* <div className='flex justify-end text-sm gap-3.5'>
                    <CommonButton
                        style={{
                            px: 'px-3.5',
                            py: 'py-2',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-blue-500',
                            hover: 'hover:bg-blue-700',
                        }}
                        label='확인'
                        onClick={() => setIsModalOpen(false)} />
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
                        onClick={closeModal} />
                </div> */}
            </div>
        </Modal>
    )
}