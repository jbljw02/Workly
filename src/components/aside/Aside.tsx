"use client"; // 클라이언트 컴포넌트로 선언

import { useState, useRef } from "react";
import SidebarItem from "./child/SidebarItem";
import SearchInput from "./child/SearchInput";
import TrashIcon from '../../../public/svgs/trash.svg';
import DocumentWrite from '../../../public/svgs/document.svg';
import TaskWrite from '../../../public/svgs/task.svg';
import ScheduleWrite from '../../../public/svgs/schedule.svg';
import HomeIcon from '../../../public/svgs/home.svg';
import DocumentIcon from '../../../public/svgs/document.svg';
import TaskIcon from '../../../public/svgs/task.svg';
import ScheduleIcon from '../../../public/svgs/schedule.svg';
import PlusIcon from '../../../public/svgs/plus.svg';
import ProjectIcon from '../../../public/svgs/project.svg';
import SettingIcon from '../../../public/svgs/setting.svg';

const expandedWidth = 240; // 넓은 상태의 너비(px)
const collapsedWidth = 70; // 좁은 상태의 너비(px)
const toggleWidthThreshold = 150; // 너비 변경을 위한 임계값

export default function Home() {
    const [sidebarWidth, setSidebarWidth] = useState(expandedWidth); // 초기 폭
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const sidebarBoundary = sidebarRef.current?.getBoundingClientRect();
        const mousePosition = e.clientX;

        if (sidebarBoundary) {
            if (mousePosition < toggleWidthThreshold) {
                setSidebarWidth(collapsedWidth);
            } else {
                setSidebarWidth(expandedWidth);
            }
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const isCollapsed = sidebarWidth === collapsedWidth;

    return (
        <aside
            ref={sidebarRef}
            className="relative border-r border-gray-300 p-4 pt-7 flex flex-col transition-all duration-300 ease-in-out"
            style={{ width: `${sidebarWidth}px` }}>
            <div
                className="resizer absolute top-0 right-0 bottom-0 w-2 cursor-col-resize"
                onMouseDown={handleMouseDown}
            ></div>
            {/* 검색창 및 작업 추가 영역 */}
            <SearchInput />
            <div className="border-b border-b-neutral-300 mb-5 mt-2 pb-3">
                <SidebarItem Icon={DocumentWrite} IconWidth="20" label="문서 작성" isCollapsed={isCollapsed} />
                <SidebarItem Icon={TaskWrite} IconWidth="20" label="작업 추가" isCollapsed={isCollapsed} />
                <SidebarItem Icon={ScheduleWrite} IconWidth="22" label="일정 추가" isCollapsed={isCollapsed} />
            </div>
            {/* 메뉴를 모아놓은 영역 */}
            <div className="mb-6">
                <SidebarItem Icon={HomeIcon} IconWidth="19" label="홈" isCollapsed={isCollapsed} />
                <SidebarItem Icon={DocumentIcon} IconWidth="18" label="문서" isCollapsed={isCollapsed} />
                <SidebarItem Icon={TaskIcon} IconWidth="18" label="작업" isCollapsed={isCollapsed} />
                <SidebarItem Icon={ScheduleIcon} IconWidth="18" label="일정" isCollapsed={isCollapsed} />
            </div>
            {/* 폴더를 추가하고 보여주는 영역 */}
            {
                !isCollapsed ?
                    <div className="mb-5">
                        <div className="text-sm font-semibold ml-2">폴더</div>
                        <div className="flex items-center pl-2 pt-2 pb-2 mt-1 rounded text-neutral-400 hover:bg-neutral-100 cursor-pointer">
                            <PlusIcon width="14" />
                            <span className="text-13px ml-2">새 폴더</span>
                        </div>
                    </div> :
                    null
            }
            {/* 휴지통 */}
            <SidebarItem Icon={TrashIcon} IconWidth="17" label="휴지통" isCollapsed={isCollapsed} />
            {/* 프로젝트 설정 div를 최하단에 위치하도록 여백 공간을 모두 차지 */}
            <div className="flex-grow"></div>
            {/* 최하단 프로젝트 관련 메뉴 */}
            <div className="text-sm">
                <SidebarItem Icon={ProjectIcon} IconWidth="20" label="내 프로젝트" isCollapsed={isCollapsed} />
                <SidebarItem Icon={SettingIcon} IconWidth="20" label="프로젝트 설정" isCollapsed={isCollapsed} />
            </div>
        </aside>
    );
}
