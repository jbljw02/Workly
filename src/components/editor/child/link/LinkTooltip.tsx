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
    const dispatch = useAppDispatch();
    const linkTooltip = useAppSelector(state => state.linkTooltip);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    // span을 이용해 요소의 크기를 구하여 input의 width 요소에 맞춤
    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    }, [linkTooltip]);

    useEffect(() => {
        const handleMouseOver = () => {
            dispatch(setLinkTooltip({
                ...linkTooltip,
                visible: true,
            }));
        };

        const handleMouseOut = (event: MouseEvent) => {
            console.log("나감");
            const relatedTarget = event.relatedTarget as HTMLElement;

            // 마우스가 툴팁 내부에 있을 경우 visible 상태를 유지합니다.
            if (relatedTarget && tooltipRef.current?.contains(relatedTarget)) {
                return;
            }

            // 마우스가 툴팁 밖으로 이동한 경우에만 visible을 false로 설정합니다.
            dispatch(setLinkTooltip({
                ...linkTooltip,
                visible: false,
            }));
        };

        const tooltipElement = tooltipRef.current;

        if (tooltipElement) {
            tooltipElement.addEventListener('mouseover', handleMouseOver);
            tooltipElement.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (tooltipElement) {
                tooltipElement.removeEventListener('mouseover', handleMouseOver);
                tooltipElement.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, [linkTooltip, dispatch]);

    return (
        <div
            ref={tooltipRef}
            className='absolute z-50 link-tooltip'
            style={{
                top: linkTooltip.position.top + window.scrollY,
                left: linkTooltip.position.left,
            }}>
            <div className='relative flex flex-row items-center mt-6 px-2 py-1.5 bg-white rounded-md shadow-[0px_4px_10px_rgba(0,0,0,0.25)]'>
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
                <div className='flex flex-row items-center space-x-1 ml-1'>
                    <div className='hover:bg-neutral-100 p-1 rounded-sm'>
                        <HoverTooltip label="편집">
                            <EditIcon width="12.5" />
                        </HoverTooltip>
                    </div>
                    <div className='hover:bg-neutral-100 p-1 rounded-sm'>
                        <HoverTooltip label="삭제">
                            <DeleteIcon width="15" />
                        </HoverTooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
