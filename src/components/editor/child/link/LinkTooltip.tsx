import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import LinkEditSection from './LinkEditSection';
import { SelectionPosition } from './AddLinkSection';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import deleteLink from '@/components/hooks/deleteLink';
import IconButton from '@/components/button/IconButton';
import LinkHoverSection from './LinkHoverSection';

export default function LinkTooltip({ editor }: { editor: Editor }) {
    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const editorScale = useAppSelector(state => state.editorScale);

    const tooltipRef = useRef<HTMLDivElement>(null);
    const [tooltipPos, setTooltipPos] = useState<SelectionPosition>({ top: 0, left: 0 });
    const [isEditing, setIsEditing] = useState(false);

    // 툴팁이 항상 a 태그 바로 아래에 위치하도록 설정
    useEffect(() => {
        const aTag = document.querySelector(`a[id="${linkTooltip.id}"]`);
        if (aTag && tooltipRef.current) {
            const rect = aTag.getBoundingClientRect();
            const bottomVal = rect.bottom + window.scrollY;
            const leftVal = rect.left + window.scrollX;

            tooltipRef.current.style.top = `${bottomVal}px`;
            tooltipRef.current.style.left = `${leftVal}px`;

            setTooltipPos({ top: bottomVal, left: leftVal });
        }
    }, [linkTooltip]);

    return (
        <div
            ref={tooltipRef}
            className={`absolute z-20 transform link-tooltip`}
            style={{
                transform: `scale(${editorScale})`, // 에디터의 scale 값을 동일하게 적용
                transformOrigin: 'top left', // 원점 설정
            }}>
            {
                isEditing ? (
                    // 링크와 제목을 수정하는 툴팁
                    <LinkEditSection
                        editor={editor}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing} />
                ) :
                    // a태그에 마우스를 올렸을 때 링크의 정보를 보이는 툴팁
                    <LinkHoverSection
                        editor={editor}
                        setIsEditing={setIsEditing} />
            }
        </div>
    );
}