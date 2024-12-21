'use client';

import { useState } from "react";
import CommonButton from "../button/CommonButton";
import AddInputModal from "../modal/AddInputModal";
import useAddDocument from "../hooks/useAddDocument";
import useAddFolder from "../hooks/useAddFolder";
import { useAppSelector } from "@/redux/hooks";

type DocumentHeaderProps = {
    title: string;
    description: string;
}

type ModalType = 'document' | 'folder' | null;

export default function DocumentHeader({ title, description }: DocumentHeaderProps) {
    const folders = useAppSelector(state => state.folders);

    const addDocToFolder = useAddDocument();
    const addNewFolder = useAddFolder();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [inputValue, setInputValue] = useState("");
    const [isInvalidInfo, setIsInvalidInfo] = useState({
        isInvalid: false,
        msg: ''
    });

    const modalProps = {
        document: {
            title: '내 폴더에 문서 추가하기',
            placeholder: "추가할 문서의 이름을 입력해주세요"
        },
        folder: {
            title: '새 폴더 추가하기',
            placeholder: "추가할 폴더의 이름을 입력해주세요"
        }
    };

    const openModal = (type: ModalType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <header className="flex flex-row justify-between items-start pt-10 px-12 pb-6 mb-5 gap-2">
            <div className="flex flex-col items-start gap-2">
                <div className="text-3xl font-semibold">{title}</div>
                <div className="pl-0.5 text-sm text-neutral-500">{description}</div>
            </div>
            <div className='flex flex-row pt-5 gap-3.5'>
                <CommonButton
                    style={{
                        width: 'w-[74px]',
                        height: 'h-[38px]',
                        textSize: 'text-sm',
                        textColor: 'text-black',
                        bgColor: 'bg-white',
                        hover: 'hover:bg-gray-100'
                    }}
                    label="새 문서"
                    onClick={() => openModal('document')} />
                <CommonButton
                    style={{
                        width: 'w-[74px]',
                        height: 'h-[38px]',
                        textSize: 'text-sm',
                        textColor: 'text-white',
                        bgColor: 'bg-black',
                        hover: 'hover:bg-zinc-800'
                    }}
                    label="새 폴더"
                    onClick={() => openModal('folder')} />
                {
                    modalType && (
                        <AddInputModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            value={inputValue}
                            setValue={setInputValue}
                            submitFunction={modalType === 'document' ?
                                () => addDocToFolder(inputValue, folders[0], setIsInvalidInfo) :
                                () => addNewFolder(inputValue, setIsInvalidInfo)}
                            category={modalType}
                            isInvalidInfo={isInvalidInfo}
                            setIsInvalidInfo={setIsInvalidInfo} />
                    )
                }
            </div>
        </header>
    )
}
