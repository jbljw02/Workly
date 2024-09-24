import PaperIcon from '../../../../../public/svgs/editor/paper.svg'
import MenuIcon from '../../../../../public/svgs/editor/menu-horizontal.svg'
import HoverTooltip from '../HoverTooltip'
import ToolbarButton from '../ToolbarButton'
import { useEffect, useRef, useState } from 'react'
import EditIcon from '../../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../../public/svgs/editor/move-folder.svg'
import MenuList from '../MenuList'
import { MenuItemProps } from '../MenuItem'
import LockIcon from '../../../../../public/svgs/editor/lock.svg'
import IconButton from '@/components/button/IconButton'
import formatTimeDiff from '@/utils/formatTimeDiff'
import { DocumentProps, setSelectedDocument } from '@/redux/features/documentSlice'
import html2pdf from 'html2pdf.js';
import { Editor } from '@tiptap/react'
import { useClickOutside } from '@/components/hooks/useClickOutside'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Folder } from '@/redux/features/folderSlice'
import getUserDocument from '@/components/hooks/getUserDocument'
import HeaderTitle from './HeaderTitle'

type EditorHeaderProps = {
    editor: Editor,
    lastUpdatedTime: string;
    setLastUpdatedTime: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditorHeader({
    editor,
    lastUpdatedTime,
    setLastUpdatedTime }: EditorHeaderProps) {
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [menuListOpen, setMenuListOpen] = useState(false);

    // 에디터 내용을 PDF로 변환하고 다운로드하는 함수
    const downloadPDF = () => {
        // 에디터에서 HTML 가져오기
        const htmlContent = editor.getHTML();

        // 변환할 HTML을 담을 임시 요소 
        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        // PDF 옵션 설정 (선택 사항)
        const options = {
            margin: 1,
            filename: selectedDocument.title || '제목 없는 문서',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 }, // 요소를 렌더링 할때의 해상도(기본 해상도의 두 배)
            // 인치 단위, A4 크기로 다운로드, 세로 방향
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // PDF 다운로드 실행
        html2pdf().from(element).set(options).save();
    };

    const menuItems: MenuItemProps[] = [
        {
            Icon: EditIcon,
            IconWidth: "16",
            label: "문서명 변경",
            onClick: () => console.log("A")
        },
        {
            Icon: MoveIcon,
            IconWidth: "15",
            label: "옮기기",
            onClick: () => console.log("A")
        },
        {
            Icon: LinkCopyIcon,
            IconWidth: "16",
            label: "링크 복사",
            onClick: () => console.log("A")
        },
        {
            Icon: DownloadIcon,
            IconWidth: "14",
            label: "다운로드",
            onClick: () => downloadPDF(),
        },
        {
            Icon: CopyIcon,
            IconWidth: "16",
            label: "사본 만들기",
            onClick: () => console.log("A"),
            horizonLine: true,
        },
        {
            Icon: DeleteIcon,
            IconWidth: "17",
            label: "휴지통으로 이동",
            onClick: () => console.log("A")
        }
    ];

    useEffect(() => {
        // 1분마다 문서의 마지막 편집 시간이 언제인지 확인
        const updatedTimeInterval = setInterval(() => {
            const updatedTime = formatTimeDiff(selectedDocument.updatedAt);
            setLastUpdatedTime(updatedTime);
        }, 60000);

        return () => clearInterval(updatedTimeInterval);
    }, [selectedDocument.updatedAt]);

    const optionRef = useRef<HTMLDivElement>(null);

    useClickOutside(optionRef, () => setMenuListOpen(false), optionRef);

    return (
        <div className='flex flex-row justify-between pl-3 pr-5 py-3'>
            {/* 헤더 좌측 영역 */}
            <HeaderTitle />
            {/* 헤더 우측 영역 */}
            <div className='flex flex-row items-center gap-1'>
                <div className='text-sm text-neutral-400 mr-1'>{lastUpdatedTime}</div>
                <HoverTooltip label='문서를 공유하거나 게시'>
                    <button className='text-sm px-1.5 py-1 rounded-sm hover:bg-gray-100 cursor-pointer'>공유</button>
                </HoverTooltip>
                <HoverTooltip label="나에게만 공개">
                    <ToolbarButton
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
                            onClick={() => setMenuListOpen(true)} />
                    </HoverTooltip>
                    {
                        menuListOpen &&
                        <MenuList
                            menuList={menuItems}
                            setListOpen={setMenuListOpen}
                            listPositon={{ top: '46px', right: '18px' }} />
                    }
                </div>
            </div>
        </div >
    )
}