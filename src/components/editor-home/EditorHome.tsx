'use client';

import '@/styles/editor.css';
import DocumentPreviewList from "./child/DocumentPreviewList";
import DocumentHeader from '../document/DocumentHeader';
import { useAppSelector } from '@/redux/hooks';

export default function EditorHome() {
    const user = useAppSelector(state => state.user);

    return (
        <div className="flex flex-col w-full h-full">
            {/* 홈의 헤더 */}
            <DocumentHeader
                title={`${user.displayName}님, 안녕하세요`}
                description={'오늘은 무엇을 작성하시겠어요?'} />
            {/* 최근 문서들의 미리보기 리스트 */}
            <DocumentPreviewList />
        </div>

    )
}