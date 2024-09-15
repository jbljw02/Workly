import DocumentIcon from '../../../../public/svgs/document.svg'
import PaperIcon from '../../../../public/svgs/editor/paper.svg'
import MenuIcon from '../../../../public/svgs/editor/menu-horizontal.svg'
import ShareIcon from '../../../../public/svgs/editor/share-folder.svg'
import HoverTooltip from './HoverTooltip'
import ToolbarButton from './ToolbarButton'
import { useEffect, useState } from 'react'
import EditIcon from '../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../public/svgs/editor/move-folder.svg'
import MenuList from './MenuList'
import { MenuItemProps } from './MenuItem'
import LockIcon from '../../../../public/svgs/editor/lock.svg'
import IconButton from '@/components/button/IconButton'
import formatTimeDiff from '@/utils/formatTimeDiff'
import { DocumentProps } from '@/redux/features/documentSlice'

type EditorHeaderProps = {
    selectedDoc: DocumentProps;
    lastUpdatedTime: string;
    setLastUpdatedTime: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditorHeader({
    selectedDoc,
    lastUpdatedTime,
    setLastUpdatedTime }: EditorHeaderProps) {
    const [menuListOpen, setMenuListOpen] = useState(false);

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
            onClick: () => console.log("A")
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
            const updatedTime = formatTimeDiff(selectedDoc.updatedAt);
            setLastUpdatedTime(updatedTime);
        }, 60000);

        return () => clearInterval(updatedTimeInterval);
    }, [selectedDoc?.updatedAt]);

    return (
        <div className='flex flex-row justify-between pl-3 pr-5 py-3'>
            {/* 헤더 좌측 영역 */}
            <div className='flex flex-row items-center gap-2'>
                <div className='flex items-center p-1 mr-0.5 border rounded-md'>
                    <PaperIcon width="20" />
                </div>
                <div className='flex flex-row items-center gap-1'>
                    <div className='text-sm rounded-sm hover:underline cursor-pointer'>이진우의 폴더</div>
                    <div className='text-sm font-light mx-1'>{'/'}</div>
                    <div className='text-sm font-bold'>미국 여행</div>
                </div>
            </div>
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
    )
}