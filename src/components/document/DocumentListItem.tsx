'use client';

import formatTimeDiff from "@/utils/formatTimeDiff";
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import ShareDocumentIcon from '../../../public/svgs/shared-document.svg'
import { useRouter } from "next/navigation";
import { DocumentProps } from "@/redux/features/documentSlice";
import { MenuItemProps } from "../editor/child/MenuItem";
import useCopyDocument from "../hooks/useCopyDocument";
import { useCopyURL } from "../hooks/useCopyURL";
import { useMemo, useRef, useState } from "react";
import MoveIcon from '../../../public/svgs/editor/move-folder.svg'
import CopyIcon from '../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../public/svgs/trash.svg'
import LinkCopyIcon from '../../../public/svgs/editor/link.svg'
import useDeleteDocument from "../hooks/useDeleteDocument";
import MenuList from "../editor/child/MenuList";
import HoverTooltip from "../editor/child/menu-bar/HoverTooltip";
import LabelButton from "../button/LabelButton";
import ShareIcon from '../../../public/svgs/group.svg';
import DownloadIcon from '../../../public/svgs/editor/download.svg';
import DocumentMoveModal from "../modal/DocumentMoveModal";
import ShareDocumentModal from "../modal/share/ShareDocumentModal";
import ShortcutsOffIcon from '../../../public/svgs/shortcuts-off.svg';
import ShortcutsOnIcon from '../../../public/svgs/shortcuts-on.svg';
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useToggleShortcuts from "../hooks/useToggleShortcuts";
import { useClickOutside } from "../hooks/useClickOutside";
import { generateHTML } from "@tiptap/react";
import extensions from "@/components/hooks/useEditorExtension";
import usePublishedExtension from "../hooks/usePublishedExtension";
import useDownloadPDF from "../hooks/useDownloadPDF";
import useCancelPublish from "../hooks/useCancelPublish";
import usePublishDocument from "../hooks/usePublishDocument";
import WebIcon from '../../../public/svgs/web.svg'
import useCheckPermission from "../hooks/useCheckPermission";
import useDocumentMenu from "../hooks/useMenuItem";

type DocumentListItemProps = {
    document: DocumentProps;
    isShared?: boolean;
    isPublished?: boolean;
}

export default function DocumentListItem({ document, isShared, isPublished }: DocumentListItemProps) {
    const router = useRouter();

    const user = useAppSelector(state => state.user);
    const optionRef = useRef<HTMLDivElement>(null);

    const copyDoc = useCopyDocument();
    const copyURL = useCopyURL();
    const deleteDoc = useDeleteDocument();
    const clickShortcut = useToggleShortcuts();
    const downloadPDF = useDownloadPDF();
    const cancelPublish = useCancelPublish();
    const publishDocument = usePublishDocument();
    const checkPermission = useCheckPermission();
    const extensions = usePublishedExtension();

    const editorPermission = useAppSelector(state => state.editorPermission);
    const [isMoving, setIsMoving] = useState(false); // 문서를 이동중인지
    const [isSharing, setIsSharing] = useState(false); // 문서를 공유중인지
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<DocumentProps | null>(null);

    const menuItems = useDocumentMenu({
        document: selectedDoc,
        editorPermission: editorPermission || '',
        isWebPublished: false,
        onMove: () => setIsMoving(true),
        onCopy: copyDoc,
        onCopyURL: copyURL,
        onDownload: () => {
            if (selectedDoc?.docContent) {
                downloadPDF(generateHTML(selectedDoc.docContent, extensions), selectedDoc.title)
            }
        },
        onDelete: deleteDoc,
        onPublish: publishDocument,
        onCancelPublish: cancelPublish
    });

    // 문서의 옵션을 클릭
    const clickDocMenu = (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();
        setSelectedDoc(document);
        checkPermission(document); // 문서에 대한 현재 사용자의 권한을 확인

        setOpenMenuId(openMenuId === document.id ? null : document.id);
    }

    useClickOutside(optionRef, () => setOpenMenuId(null));

    return (
        <>
            <div
                className='flex items-center w-full hover:bg-gray-100 cursor-pointer transition-all duration-150 group'
                onClick={() => {
                    isPublished ?
                        window.open(`/web-published/${document.folderId}/${document.id}`, '_blank') :
                        router.push(`/editor/${document.folderId}/${document.id}`)
                }}>
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
                        <div className='flex flex-row items-center gap-2'>
                            <div className='text-[15px] ml-0.5 font-semibold truncate'>
                                {document.title || '제목 없는 문서'}
                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-2 text-xs mt-1 text-neutral-500'>
                            <span className='bg-gray-100 group-hover:bg-gray-200 rounded px-1.5 py-0.5 truncate transition-colors duration-150'>
                                {/* 게시된 문서인지, 공유된 문서인지에 따라 분기 */}
                                {
                                    isPublished ?
                                        `${document.publishedUser?.displayName}에 의해 게시됨` :
                                        (
                                            isShared ?
                                                `${document.author.displayName}에 의해 공유됨` :
                                                document.folderName
                                        )
                                }
                            </span>
                            <span>
                                {/* 게시된 문서라면 게시 날짜, 그 외엔 열람일 출력 */}
                                {
                                    isPublished ?
                                        formatTimeDiff(document.publishedDate!, true) :
                                        formatTimeDiff(document.readedAt)
                                }
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                        {/* 즐겨찾기 아이콘 */}
                        <HoverTooltip label="즐겨찾기">
                            <LabelButton
                                Icon={
                                    document.shortcutsUsers.includes(user.email) ?
                                        ShortcutsOnIcon :
                                        ShortcutsOffIcon
                                }
                                iconWidth={19}
                                onClick={(e) => clickShortcut(e, document)}
                                hover="hover:bg-gray-200" />
                        </HoverTooltip>
                        {/* 메뉴의 옵션 */}
                        <div ref={optionRef}>
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
            </div>
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
        </>
    )
}