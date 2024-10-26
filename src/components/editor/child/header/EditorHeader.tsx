import MenuIcon from '../../../../../public/svgs/editor/menu-horizontal.svg'
import { useEffect, useRef, useState } from 'react'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../../public/svgs/editor/move-folder.svg'
import MenuList from '../MenuList'
import { MenuItemProps } from '../MenuItem'
import LockIcon from '../../../../../public/svgs/editor/lock.svg'
import formatTimeDiff from '@/utils/formatTimeDiff'
import { Editor } from '@tiptap/react'
import { useClickOutside } from '@/components/hooks/useClickOutside'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import HeaderTitle from './HeaderTitle'
import DocumentMoveModal from '@/components/modal/DocumentMoveModal'
import { usePathname } from 'next/navigation'
import HoverTooltip from '../menuBar/HoverTooltip'
import ToolbarButton from '../menuBar/ToolbarButton'
import ShareDocumentModal from '@/components/modal/share/ShareDocumentModal'
import useDeleteDocument from '@/components/hooks/useDeleteDocument'
import { useCopyURL } from '@/components/hooks/useCopyURL'
import useDownloadPDF from '@/components/hooks/useDownloadPDF'
import useCopyDocument from '@/components/hooks/useCopyDocument'

type EditorHeaderProps = {
    editor: Editor,
    docTitle: string,
    lastUpdatedTime: string;
    setLastUpdatedTime: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditorHeader({
    editor,
    docTitle,
    lastUpdatedTime,
    setLastUpdatedTime }: EditorHeaderProps) {
    const deleteDoc = useDeleteDocument();
    const copyDoc = useCopyDocument();
    const copyURL = useCopyURL();
    const downloadPDF = useDownloadPDF();
    
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스
    
    const optionRef = useRef<HTMLDivElement>(null);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [menuListOpen, setMenuListOpen] = useState(false);
    const [isMoving, setIsMoving] = useState(false); // 문서가 이동중인지
    const [isShareModal, setIsShareModal] = useState(false); // 문서가 공유됐는지

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
            onClick: () => copyDoc(selectedDocument),
        },
        {
            Icon: LinkCopyIcon,
            IconWidth: "16",
            label: "링크 복사",
            onClick: () => copyURL(folderId, documentId),
        },
        {
            Icon: DownloadIcon,
            IconWidth: "14",
            label: "다운로드",
            onClick: () => downloadPDF(editor, docTitle),
        },
        {
            Icon: DeleteIcon,
            IconWidth: "17",
            label: "휴지통으로 이동",
            onClick: (e) => deleteDoc(e, selectedDocument),
            horizonLine: true,
        }
    ];

    useEffect(() => {
        // 1분마다 문서의 마지막 편집 시간이 언제인지 확인
        const updatedTimeInterval = setInterval(() => {
            const updatedTime = formatTimeDiff(selectedDocument.updatedAt);
            console.log("updatedTime: ", updatedTime);
            setLastUpdatedTime(updatedTime);
        }, 60000);

        return () => clearInterval(updatedTimeInterval);
    }, [selectedDocument.updatedAt]);

    useClickOutside(optionRef, () => setMenuListOpen(false), optionRef);

    return (
        <div className='flex flex-row justify-between pl-3 pr-5 py-3'>
            {/* 헤더 좌측 영역 */}
            <HeaderTitle />
            {/* 헤더 우측 영역 */}
            <div className='flex flex-row items-center gap-1'>
                <div className='text-sm text-neutral-400 mr-1'>{lastUpdatedTime}</div>
                <HoverTooltip label='문서를 공유하거나 게시'>
                    <button
                        onClick={() => setIsShareModal(true)}
                        className='text-sm px-1.5 py-1 rounded-sm hover:bg-gray-100 cursor-pointer'>공유</button>
                </HoverTooltip>
                <HoverTooltip label="나에게만 공개">
                    <ToolbarButton
                        onClick={() => console.log("lock")}
                        Icon={LockIcon}
                        iconWidth={20} />
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