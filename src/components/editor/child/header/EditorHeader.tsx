import MenuIcon from '../../../../../public/svgs/editor/menu-horizontal.svg'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MenuList from '../../../menu/MenuList'
import { MenuItemProps } from '../../../menu/MenuItem'
import LockIcon from '../../../../../public/svgs/editor/lock.svg'
import UnLockIcon from '../../../../../public/svgs/editor/un-lock.svg'
import { Editor } from '@tiptap/react'
import { useClickOutside } from '@/components/hooks/useClickOutside'
import { useAppSelector } from '@/redux/hooks'
import HeaderTitle from './HeaderTitle'
import DocumentMoveModal from '@/components/modal/DocumentMoveModal'
import HoverTooltip from '../../../tooltip/HoverTooltip'
import ToolbarButton from '../../../button/ToolbarButton'
import ShareDocumentModal from '@/components/modal/share/ShareDocumentModal'
import useDeleteDocument from '@/components/hooks/useDeleteDocument'
import { useCopyURL } from '@/components/hooks/useCopyURL'
import useDownloadPDF from '@/components/hooks/useDownloadPDF'
import useCopyDocument from '@/components/hooks/useCopyDocument'
import ConnectedUsers from './ConnectedUserList'
import WebIcon from '../../../../../public/svgs/web.svg'
import useCancelPublish from '@/components/hooks/useCancelPublish'
import usePublishDocument from '@/components/hooks/usePublishDocument'
import useCheckPermission from '@/components/hooks/useCheckPermission'
import useDocumentMenu from '@/components/hooks/useMenuItem'

type EditorHeaderProps = {
    editor: Editor,
}

export default function EditorHeader({ editor }: EditorHeaderProps) {
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
    // 문서가 게시됐는지
    const isPublished = useMemo(() => selectedDocument.isPublished,
        [selectedDocument.isPublished]);

    const optionRef = useRef<HTMLDivElement>(null);

    const [menuListOpen, setMenuListOpen] = useState(false);
    const [isMoving, setIsMoving] = useState(false); // 문서가 이동중인지
    const [isShareModal, setIsShareModal] = useState(false); // 문서가 공유됐는지

    // 현재 접속중인 사용자가 문서에 어떤 권한을 가지고 있는지
    useEffect(() => {
        checkPermission(selectedDocument);
    }, [selectedDocument.collaborators, selectedDocument.author.email, user.email]);

    // 문서에 지정할 수 있는 옵션의 목록
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
                {/* 게시된 문서라면 아이콘 표시 */}
                {
                    isPublished &&
                    <HoverTooltip label='게시된 문서'>
                        <ToolbarButton
                            Icon={WebIcon}
                            iconWidth={19} />
                    </HoverTooltip>
                }
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