import deleteLink from '@/components/hooks/deleteLink';
import InputControlSpan from '@/components/input/InputControlSpan';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useRef } from 'react';
import WorldIcon from '../../../../../public/svgs/editor/world.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import HoverTooltip from '../menuBar/HoverTooltip';
import ToolbarButton from '../menuBar/ToolbarButton';
import LabelButton from '@/components/button/LabelButton';
import { LinkSectionProps } from '@/types/linkSectionProps';

export default function LinkHoverSection({ editor, setIsEditing }: LinkSectionProps) {
    const dispatch = useAppDispatch();

    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    // span을 이용해 요소의 크기를 구하여 input의 width 요소에 맞춤
    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    }, [linkTooltip]);

    return (
        <div className={`relative flex flex-row items-center mt-2 px-2 py-1.5 border border-neutral-300 bg-white rounded-md shadow-[0px_4px_10px_rgba(0,0,0,0.25)] transition-opacity ease-in-out duration-300
            ${linkTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
            <div className='flex flex-row items-center justify-end ml-1'>
                <HoverTooltip label="편집">
                    <LabelButton
                        onClick={() => setIsEditing(true)}
                        Icon={EditIcon}
                        iconWidth={12.5}
                        hover="hover:bg-gray-100" />
                </HoverTooltip>
                <HoverTooltip label="삭제">
                    <LabelButton
                        onClick={() => deleteLink(editor, linkTooltip, dispatch)}
                        Icon={DeleteIcon}
                        iconWidth={15}
                        hover="hover:bg-gray-100" />
                </HoverTooltip>
            </div>
        </div>
    )
}