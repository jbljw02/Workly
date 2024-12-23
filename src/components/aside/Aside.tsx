'use client';

import { useState, useRef } from "react";
import SidebarItem from "./child/SidebarItem";
import SearchInput from "./child/search/SearchInputButton";
import TrashIcon from '../../../public/svgs/trash.svg';
import HomeIcon from '../../../public/svgs/home.svg';
import DocumentIcon from '../../../public/svgs/document.svg';
import { useAppSelector } from "@/redux/hooks";
import FolderSection from "./child/folder/FolderSection";
import UserSection from "./child/user/UserSection";
import GroupIcon from '../../../public/svgs/group.svg';
import useAddDocument from "../hooks/useAddDocument";
import Trash from "../trash/Trash";
import ShortcutIcon from '../../../public/svgs/shortcuts-off.svg';
import WebIcon from '../../../public/svgs/web.svg';
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";

export default function Aside() {
    const router = useRouter();

    const addDocToFolder = useAddDocument();
    const folders = useAppSelector(state => state.folders);

    const expandedWidth = 240; // 넓은 상태의 너비
    const collapsedWidth = 70; // 좁은 상태의 너비
    const toggleWidthThreshold = 150; // 너비 변경을 위한 임계값

    const [sidebarWidth, setSidebarWidth] = useState(expandedWidth); // 사이드바의 현재 너비
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const isCollapsed = sidebarWidth === collapsedWidth; // 사이드바가 축소 상태인지 여부

    // 리사이저 핸들을 클릭했을 때 발생
    const clickResizer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.addEventListener("mousemove", adjustSidebarWidth);
        document.addEventListener("mouseup", removeResizerEventListener);
    };

    // 마우스를 이동할 때마다 사이드바의 너비 조정
    const adjustSidebarWidth = (e: MouseEvent) => {
        // 사이드바의 현재 위치와 크기를 가져옴 
        const sidebarBoundary = sidebarRef.current?.getBoundingClientRect();
        const mousePosition = e.clientX; // 현재 마우스 커서의 X 좌표

        if (sidebarBoundary) {
            // 마우스 커서가 임계값보다 왼쪽에 위치할 시 사이드바 축소
            if (mousePosition < toggleWidthThreshold) {
                setSidebarWidth(collapsedWidth);
            }
            else {
                setSidebarWidth(expandedWidth);
            }
        }
    };

    // 마우스를 리사이저 핸들에서 놓을 시 이벤트 리스너 제거
    const removeResizerEventListener = () => {
        document.removeEventListener("mousemove", adjustSidebarWidth);
        document.removeEventListener("mouseup", removeResizerEventListener);
    };

    // 마우스가 리사이저에 들어왔을 때 사이드바의 border width 변경
    const mouserEnterToResizer = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.setProperty('--resizer-border-width', '2px');
        }
    };

    // 마우스가 리사이저에서 나갔을 때
    const mouseLeaveFromResizer = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.setProperty('--resizer-border-width', '1px');
        }
    };

    return (
        <aside
            ref={sidebarRef}
            className={`relative h-full p-4 pt-5 flex flex-col transition-width duration-300 ease-in-out flex-shrink-0`}
            style={{
                width: `${sidebarWidth}px`,
                transitionProperty: 'width',
                boxSizing: 'border-box',
                position: 'relative'
            }}>
            {/* aside의 너비를 변경시키는 리사이저 */}
            <div
                className="resizer absolute top-0 right-[-5px] bottom-0 w-2 cursor-col-resize z-10"
                onMouseDown={clickResizer}
                onMouseEnter={mouserEnterToResizer}
                onMouseLeave={mouseLeaveFromResizer} />
            {/* aside의 우측에서 border에 커서를 올렸을 때 border의 크기가 넓어지는 것처럼 출력 */}
            <div
                className="absolute top-0 right-0 bottom-0"
                style={{
                    width: 'var(--resizer-border-width, 1px)',
                    backgroundColor: '#D1D5DB',
                    transition: 'width 0.2s ease',
                }} />
            {/* 사용자의 정보 영역 */}
            <UserSection />
            {/* 검색창 및 작업 추가 영역 */}
            <SearchInput isCollapsed={isCollapsed} />
            {/* 메뉴를 모아놓은 영역 */}
            <div className="border-b border-b-neutral-300 mb-6 mt-2 pb-5">
                <Link href="/editor/home">
                    <SidebarItem
                        Icon={HomeIcon}
                        IconWidth="17"
                        label="홈"
                        isCollapsed={isCollapsed} />
                </Link>
                <SidebarItem
                    Icon={DocumentIcon}
                    IconWidth="17"
                    label="문서"
                    isCollapsed={isCollapsed}
                    onClick={() => router.push('/editor/document')}
                    addClick={() => {
                        addDocToFolder('', folders[0]);
                    }} />
                <Link href="/editor/shared">
                    <SidebarItem
                        Icon={GroupIcon}
                        IconWidth="18"
                        label="공유중인 문서"
                        isCollapsed={isCollapsed} />
                </Link>
                <Link href="/editor/published">
                    <SidebarItem
                        Icon={WebIcon}
                        IconWidth="17"
                        label="게시된 문서"
                        isCollapsed={isCollapsed} />
                </Link>
                <Link href="/editor/shortcuts">
                    <SidebarItem
                        Icon={ShortcutIcon}
                        IconWidth="22"
                        label="즐겨찾기"
                        isCollapsed={isCollapsed} />
                </Link>
            </div>
            {/* 폴더를 추가하고 보여주는 영역 */}
            <FolderSection isCollapsed={isCollapsed} />
            {/* 멤버 추가 div를 최하단에 위치하도록 여백 공간을 모두 차지 */}
            <div className="flex-grow" />
            {/* 휴지통 아이콘과 휴지통 내용 영역 */}
            <Trash isCollapsed={isCollapsed} />
        </aside>
    );
}
