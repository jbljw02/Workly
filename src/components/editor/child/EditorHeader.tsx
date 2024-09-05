import DocumentIcon from '../../../../public/svgs/document.svg'
import PaperIcon from '../../../../public/svgs/editor/paper.svg'
import MenuIcon from '../../../../public/svgs/editor/menu-horizontal.svg'
import ShareIcon from '../../../../public/svgs/editor/share-folder.svg'
import HoverTooltip from './HoverTooltip'
import ToolbarButton from './ToolbarButton'
import { useState } from 'react'
import EditIcon from '../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../public/svgs/move-folder.svg'
import MenuList from './MenuList'
import { MenuItemProps } from './MenuItem'

export default function EditorHeader() {
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

    return (
        <div className='flex flex-row justify-between pl-3 pr-5 py-2 border-b'>
            <div className='flex flex-row items-center'>
                <div className='flex items-center p-2 mr-1 border rounded-md'>
                    <PaperIcon width="25" />
                </div>
                <div className='flex flex-col ml-2'>
                    <div className='flex flex-row'>
                        <div className='text-base'>미국 여행</div>
                    </div>
                    <div className='flex flex-row text-xs text-neutral-400 hover:underline cursor-pointer select-none'>
                        북아메리카 여행
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center space-x-2'>
                {/* <div className='text-sm'>공유</div> */}
                <HoverTooltip label='공유 및 접근 권한 부여'>
                    <ToolbarButton
                        Icon={ShareIcon}
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
                        listPositon={{ top: 12, right: 4 }} />
                }
            </div>
        </div>
    )
}