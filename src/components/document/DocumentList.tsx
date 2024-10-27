'use client';

import formatTimeDiff from "@/utils/formatTimeDiff";
import IconButton from "../button/LabelButton";
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import ShareDocumentIcon from '../../../public/svgs/shared-document.svg'
import { useRouter } from "next/navigation";
import { DocumentProps, selectedDocument } from "@/redux/features/documentSlice";
import EmptyFolderIcon from '../../../public/svgs/empty-folder.svg';
import { deleteDoc, documentId } from "firebase/firestore";
import { MenuItemProps } from "../editor/child/MenuItem";
import useCopyDocument from "../hooks/useCopyDocument";
import { useCopyURL } from "../hooks/useCopyURL";
import useDownloadPDF from "../hooks/useDownloadPDF";
import { useRef, useState } from "react";
import MoveIcon from '../../../public/svgs/editor/move-folder.svg'
import DownloadIcon from '../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../public/svgs/trash.svg'
import LinkCopyIcon from '../../../public/svgs/editor/link.svg'
import useDeleteDocument from "../hooks/useDeleteDocument";
import MenuList from "../editor/child/MenuList";
import HoverTooltip from "../editor/child/menu-bar/HoverTooltip";
import { useClickOutside } from "../hooks/useClickOutside";
import LabelButton from "../button/LabelButton";
import ShareIcon from '../../../public/svgs/group.svg';
import DocumentMoveModal from "../modal/DocumentMoveModal";
import ShareDocumentModal from "../modal/share/ShareDocumentModal";

type DocumentListProps = {
    documents: DocumentProps[];
    isShared?: boolean;
}

export default function DocumentList({ documents, isShared }: DocumentListProps) {
    const router = useRouter();

    const optionRef = useRef<HTMLDivElement>(null);

    const copyDoc = useCopyDocument();
    const copyURL = useCopyURL();
    const deleteDoc = useDeleteDocument();

    const [isMoving, setIsMoving] = useState(false); // 문서를 이동중인지
    const [isSharing, setIsSharing] = useState(false); // 문서를 공유중인지

    const [openMenuId, setOpenMenuId] = useState<string | null>(null); // 메뉴를 오픈할 문서의 ID
    const [selectedDoc, setSelectedDoc] = useState<DocumentProps | null>(null);

    const menuItems: MenuItemProps[] = [
        {
            Icon: MoveIcon,
            IconWidth: "15",
            label: "옮기기",
            onClick: () => setIsMoving(true),
        },
        {
            Icon: CopyIcon,
            IconWidth: "16",
            label: "사본 만들기",
            onClick: () => copyDoc(selectedDoc!),
        },
        {
            Icon: LinkCopyIcon,
            IconWidth: "16",
            label: "링크 복사",
            onClick: () => copyURL(selectedDoc!.folderId, selectedDoc!.id),
        },
        {
            Icon: ShareIcon,
            IconWidth: "16",
            label: "공유하기",
            onClick: () => setIsSharing(true),
        },
        {
            Icon: DeleteIcon,
            IconWidth: "17",
            label: "휴지통으로 이동",
            onClick: (e) => deleteDoc(e, selectedDoc!),
            horizonLine: true,
        }
    ];

    // 문서의 옵션을 클릭
    const clickDocMenu = (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();

        setOpenMenuId(openMenuId === document.id ? null : document.id);
        setSelectedDoc(document);
    }

    useClickOutside(optionRef, () => setOpenMenuId(null));

    return (
        <div className='flex flex-col w-full h-full'>
            {
                documents.length > 0 ? (
                    documents.map(document => (
                        <div
                            key={document.id}
                            className='flex items-center w-full hover:bg-gray-100 cursor-pointer transition-all duration-150 group'
                            onClick={() => router.push(`/editor/${document.folderId}/${document.id}`)}>
                            <div
                                className='relative flex flex-1 items-center py-5 mx-12 border-b'>
                                {/* 문서 아이콘 */}
                                <div className='p-1 rounded-lg border-gray-200 border mr-4'>
                                    <ShareDocumentIcon
                                        className="text-gray-400"
                                        width="36" />
                                </div>
                                {/* 문서 정보 */}
                                <div className='flex-1 flex flex-col'>
                                    <div className='text-[15px] ml-0.5 font-semibold truncate'>
                                        {document.title || '제목 없는 문서'}
                                    </div>
                                    <div className='flex flex-row items-center gap-2 text-xs mt-1 text-neutral-500'>
                                        <span className='bg-gray-100 group-hover:bg-gray-200 rounded px-1.5 py-0.5 truncate transition-colors duration-150'>
                                            {
                                                isShared ?
                                                    `${document.author.displayName}에 의해 공유됨` :
                                                    document.folderName
                                            }
                                        </span>
                                        <span>{formatTimeDiff(document.updatedAt)}</span>
                                    </div>
                                </div>
                                {/* 메뉴의 옵션 */}
                                <div
                                    ref={optionRef}
                                    className='justify-end items-center'>
                                    <HoverTooltip label="옵션">
                                        <LabelButton
                                            Icon={MenuIcon}
                                            iconWidth={17}
                                            onClick={(e) => clickDocMenu(e, document)}
                                            hover="hover:bg-gray-200" />
                                    </HoverTooltip>
                                    <MenuList
                                        isOpen={openMenuId === document.id}
                                        menuList={menuItems}
                                        setListOpen={() => setOpenMenuId(null)}
                                        listPositon={{ top: '60px', right: '3px' }} />
                                </div>
                            </div>
                        </div>
                    ))
                ) :
                    (
                        <div className="flex items-center justify-center w-full h-full text-neutral-500 gap-4 mb-14">
                            <EmptyFolderIcon width="48" />
                            <div className="text-lg">아직 문서가 존재하지 않습니다.</div>
                        </div>
                    )
            }
            {/* 문서 이동 모달 */}
            <DocumentMoveModal
                isModalOpen={isMoving}
                setIsModalOpen={setIsMoving}
                selectedDoc={selectedDoc!} />
            {/* 문서 공유 모달 */}
            <ShareDocumentModal
                isModalOpen={isSharing}
                setIsModalOpen={setIsSharing}
                selectedDoc={selectedDoc!} />
        </div>
    )
}
