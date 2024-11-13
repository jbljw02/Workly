import MenuIcon from '../../../../../public/svgs/editor/menu-horizontal.svg'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../../public/svgs/editor/move-folder.svg'
import MenuList from '../MenuList'
import { MenuItemProps } from '../MenuItem'
import LockIcon from '../../../../../public/svgs/editor/lock.svg'
import UnLockIcon from '../../../../../public/svgs/editor/un-lock.svg'
import formatTimeDiff from '@/utils/formatTimeDiff'
import { Editor } from '@tiptap/react'
import { useClickOutside } from '@/components/hooks/useClickOutside'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import HeaderTitle from './HeaderTitle'
import DocumentMoveModal from '@/components/modal/DocumentMoveModal'
import { usePathname } from 'next/navigation'
import HoverTooltip from '../menu-bar/HoverTooltip'
import ToolbarButton from '../menu-bar/ToolbarButton'
import ShareDocumentModal from '@/components/modal/share/ShareDocumentModal'
import useDeleteDocument from '@/components/hooks/useDeleteDocument'
import { useCopyURL } from '@/components/hooks/useCopyURL'
import useDownloadPDF from '@/components/hooks/useDownloadPDF'
import useCopyDocument from '@/components/hooks/useCopyDocument'
import { setCoworkerList, setEditorPermission } from '@/redux/features/shareDocumentSlice'
import ConnectedUsers from './ConnectedUserList'
import WebIcon from '../../../../../public/svgs/web.svg'
import PublishIcon from '../../../../../public/svgs/publish.svg'
import useCancelPublish from '@/components/hooks/useCancelPublish'
import usePublishDocument from '@/components/hooks/usePublishDocument'
import { DocumentProps } from '@/redux/features/documentSlice'
import useCheckPermission from '@/components/hooks/useCheckPermission'
import useDocumentMenu from '@/components/hooks/useMenuItem'

type EditorHeaderProps = {
    editor: Editor,
    docTitle: string,
}

export default function EditorHeader({ editor, docTitle }: EditorHeaderProps) {
    const deleteDoc = useDeleteDocument();
    const copyDoc = useCopyDocument();
    const copyURL = useCopyURL();
    const downloadPDF = useDownloadPDF();
    const cancelPublish = useCancelPublish();
    const publishDocument = usePublishDocument();
    const checkPermission = useCheckPermission();

    const user = useAppSelector(state => state.user);
    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const editorPermission = useAppSelector(state => state.editorPermission);
    const webPublished = useAppSelector(state => state.webPublished);

    // 문서의 관리자인지
    const isAuthor = useMemo(() => selectedDocument.author.email === user.email,
        [selectedDocument.author.email, user.email]);
    // 문서가 공유됐는지
    const isShared = useMemo(() => selectedDocument.collaborators.length > 0,
        [selectedDocument.collaborators]);

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const optionRef = useRef<HTMLDivElement>(null);

    const [menuListOpen, setMenuListOpen] = useState(false);
    const [isMoving, setIsMoving] = useState(false); // 문서가 이동중인지
    const [isShareModal, setIsShareModal] = useState(false); // 문서가 공유됐는지

    useEffect(() => {
        checkPermission(selectedDocument);
    }, [selectedDocument.collaborators, selectedDocument.author.email, user.email]);

    const menuItems = useDocumentMenu({
        document: selectedDocument,
        editorPermission: editorPermission || '',
        isWebPublished: false,
        onMove: () => setIsMoving(true),
        onCopy: copyDoc,
        onCopyURL: copyURL,
        onDownload: () => {
            if (selectedDocument.docContent) {
                downloadPDF(editor.getHTML(), selectedDocument.title)
            }
        },
        onDelete: deleteDoc,
        onPublish: publishDocument,
        onCancelPublish: cancelPublish
    });


    useClickOutside(optionRef, () => setMenuListOpen(false), optionRef);

    return (
        <div className='flex flex-row justify-between border-b pl-3 pr-5 py-3'>
            {/* 헤더 좌측 영역 */}
            <HeaderTitle />
            {/* 헤더 우측 영역 */}
            <div className='flex flex-row items-center gap-1'>
                {/* 현재 문서에 연결중인 사용자를 나열 */}
                {
                    !webPublished && (
                        <>
                            <ConnectedUsers />
                            <HoverTooltip label='문서를 공유하거나 게시'>
                                <button
                                    onClick={() => setIsShareModal(true)}
                                    className='text-sm px-1.5 py-1 rounded-sm hover:bg-gray-100 cursor-pointer'>공유</button>
                            </HoverTooltip>
                        </>
                    )
                }
                {/* 게시된 문서인지 먼저 확인한 뒤, 아니라면 공유중인 문서인지 확인 */}
                <HoverTooltip label={webPublished ? '공개된 문서' : (isShared ? '공유중인 문서' : '나에게만 공개')}>
                    {
                        <ToolbarButton
                            Icon={webPublished ? WebIcon : (isShared ? UnLockIcon : LockIcon)}
                            iconWidth={webPublished ? 17 : 20} />
                    }
                </HoverTooltip>
                <div
                    onClick={() => setMenuListOpen(!menuListOpen)}
                    ref={optionRef}>
                    <HoverTooltip label="옵션">
                        <ToolbarButton
                            Icon={MenuIcon}
                            iconWidth={25}
                            onClick={() => setMenuListOpen(!menuListOpen)} />
                    </HoverTooltip>
                    <MenuList
                        isOpen={menuListOpen}
                        menuList={menuItems}
                        setListOpen={setMenuListOpen}
                        listPositon={{ top: '46px', right: '18px' }} />
                </div>
            </div>
            {/* 문서 이동 모달 */}
            <DocumentMoveModal
                isModalOpen={isMoving}
                setIsModalOpen={setIsMoving}
                selectedDoc={selectedDocument} />
            {/* 문서 공유 모달 */}
            <ShareDocumentModal
                isModalOpen={isShareModal}
                setIsModalOpen={setIsShareModal}
                selectedDoc={selectedDocument} />
        </div>
    )
}