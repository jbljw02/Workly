import BottomProjectSection from "./child/BottomProjectSection";
import FolderSection from "./child/FolderSection";
import MenuSection from "./child/MenuSection";
import SidebarItem from "./child/SidebarItem";
import TopActionSection from "./child/TopActionSection";
import TrashIcon from '../../../public/svgs/trash.svg'

export default function Home() {
    return (
        <aside className="w-72 p-4 pt-7 border-r flex flex-col">
            {/* 검색창 및 작업 추가 영역 */}
            <TopActionSection />
            {/* 메뉴를 모아놓은 영역 */}
            <MenuSection />
            {/* 폴더를 추가하고 보여주는 영역 */}
            <FolderSection />
            {/* 휴지통 */}
            <SidebarItem
                Icon={TrashIcon}
                IconWidth='16'
                label="휴지통" />
            {/* 프로젝트 설정 div를 최하단에 위치하도록 여백 공간을 모두 차지 */}
            <div className="flex-grow"></div>
            {/* 최하단 프로젝트 관련 메뉴 */}
            <BottomProjectSection />
        </aside>
    )
}