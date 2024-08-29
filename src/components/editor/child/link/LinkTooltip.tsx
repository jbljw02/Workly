import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setLinkTooltip } from '@/redux/features/linkSlice';
import WorldIcon from '../../../../../public/svgs/editor/world.svg';
import MenuIcon from '../../../../../public/svgs/editor/menu.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import { useEffect, useRef } from 'react';
import InputControlSpan from '@/components/input/InputControlSpan';
import HoverTooltip from '../HoverTooltip';

export default function LinkTooltip() {
    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const editorScale = useAppSelector(state => state.editorScale);

    const tooltipRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    // span을 이용해 요소의 크기를 구하여 input의 width 요소에 맞춤
    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    }, [linkTooltip]);

    // 툴팁이 항상 a 태그 바로 아래에 위치하도록 설정
    useEffect(() => {
        const aTag = document.querySelector(`a[href="${linkTooltip.href}"]`);
        if (aTag && tooltipRef.current) {
            const rect = aTag.getBoundingClientRect();
            tooltipRef.current.style.top = `${rect.bottom + window.scrollY}px`;
            tooltipRef.current.style.left = `${rect.left + window.scrollX}px`;
        }
    }, [linkTooltip]);

    return (
        <div
            ref={tooltipRef}
            className={`absolute z-50 link-tooltip transform transition-opacity ease-in-out duration-300
                ${linkTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
                transform: `scale(${editorScale})`, // 에디터의 scale 값을 동일하게 적용
                transformOrigin: 'top left', // 원점 설정
            }}>
            <div className='relative flex flex-row items-center mt-2 px-2 py-1.5 bg-white rounded-md shadow-[0px_4px_10px_rgba(0,0,0,0.25)]'>
                {/* 링크를 보여주는 input */}
                <div className='flex flex-row'>
                    <WorldIcon width="12.5" />
                    <input
                        ref={inputRef}
                        className="bg-transparent border-none outline-none box-border text-sm ml-2 text-ellipsis max-w-[150px]"
                        value={linkTooltip.href}
                        readOnly />
                    <InputControlSpan
                        ref={spanRef}
                        label={linkTooltip.href} />
                </div>
                {/* 편집 및 삭제 아이콘 */}
                <div className='flex flex-row items-center ml-1'>
                    <div className='hover:bg-neutral-100 p-1 rounded-sm cursor-pointer'>
                        <HoverTooltip label="편집">
                            <EditIcon width="12.5" />
                        </HoverTooltip>
                    </div>
                    <div className='hover:bg-neutral-100 p-1 rounded-sm cursor-pointer'>
                        <HoverTooltip label="삭제">
                            <DeleteIcon width="15" />
                        </HoverTooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}