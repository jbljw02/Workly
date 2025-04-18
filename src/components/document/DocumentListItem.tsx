'use client';

import formatTimeDiff from "@/utils/format/formatTimeDiff";
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import ShareDocumentIcon from '../../../public/svgs/shared-document.svg'
import { DocumentProps } from "@/types/document.type";
import useCopyDocument from "@/hooks/document/useCopyDocument";
import { useRef, useState } from "react";
import useDeleteDocument from "@/hooks/document/useDeleteDocument";
import MenuList from "@/components/menu/MenuList";
import HoverTooltip from "../tooltip/HoverTooltip";
import LabelButton from "../button/LabelButton";
import DocumentMoveModal from "../modal/DocumentMoveModal";
import ShareDocumentModal from "../modal/share/ShareDocumentModal";
import ShortcutsOffIcon from '../../../public/svgs/shortcuts-off.svg';
import ShortcutsOnIcon from '../../../public/svgs/shortcuts-on.svg';
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useToggleShortcuts from "@/hooks/document/useToggleShortcuts";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { generateHTML } from "@tiptap/react";
import useBasicExtension from "@/hooks/editor/extension/useBasicExtension";
import useCheckPermission from "@/hooks/editor/useCheckPermission";
import { useRouter } from "next-nprogress-bar";
import copyURL from "@/utils/editor/copyURL";
import useCancelPublish from "@/hooks/document/useCancelPublish";
import useDownloadPDF from "@/hooks/document/useDownloadPDF";
import useDocumentMenu from "@/hooks/document/useMenuItem";
import usePublishDocument from "@/hooks/document/usePublishDocument";
import useCheckDemo from "@/hooks/demo/useCheckDemo";

type DocumentListItemProps = {
    document: DocumentProps;
    isShared?: boolean;
    isPublished?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function DocumentListItem({ document, isShared, isPublished }: DocumentListItemProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const checkDemo = useCheckDemo();

    const user = useAppSelector(state => state.user);
    const optionRef = useRef<HTMLDivElement>(null);

    const copyDoc = useCopyDocument();
    const deleteDoc = useDeleteDocument();
    const clickShortcut = useToggleShortcuts();
    const downloadPDF = useDownloadPDF();
    const cancelPublish = useCancelPublish();
    const publishDocument = usePublishDocument();
    const checkPermission = useCheckPermission();
    const extensions = useBasicExtension();

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
        onCopyURL: () => copyURL(`${baseURL}/editor/${document.folderId}/${document.id}`, dispatch),
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
                        (
                            checkDemo() ?
                                router.push(`/demo/${document.folderId}/${document.id}`) :
                                router.push(`/editor/${document.folderId}/${document.id}`)
                        )
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
                        <div>
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
                        </div>
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