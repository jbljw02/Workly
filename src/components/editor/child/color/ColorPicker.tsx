import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import ToolbarButton from '../../../button/ToolbarButton';
import FontColorIcon from '../../../../../public/svgs/editor/font-color.svg';
import HoverTooltip from '../../../tooltip/HoverTooltip';
import { SketchPicker, ColorResult } from 'react-color';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setOpenColorPicker, setTextColor } from '@/redux/features/editor/textColorSlice';

type ColorPickerProps = {
    editor: Editor;
}

export default function ColorPicker({ editor }: ColorPickerProps) {
    const dispatch = useAppDispatch();

    const pickerRef = useRef<HTMLDivElement>(null);

    const textColor = useAppSelector(state => state.textColor);
    const openColorPicker = useAppSelector(state => state.openColorPicker);

    const handleChange = (color: ColorResult) => {
        dispatch(setTextColor(color.hex));
        editor.chain().focus().setColor(color.hex).run();
    };

    useClickOutside(pickerRef, () => dispatch(setOpenColorPicker(false)));

    return (
        <div className="relative inline-block" ref={pickerRef}>
            {
                editor && (
                    <>
                        <HoverTooltip label='글자 색상'>
                            <ToolbarButton
                                onClick={() => dispatch(setOpenColorPicker(true))}
                                isActive={openColorPicker}
                                Icon={FontColorIcon}
                                iconWidth={17}
                                iconFill={textColor} />
                        </HoverTooltip>
                        {
                            openColorPicker && (
                                <div className="absolute top-full left-0 mt-2 border border-neutral-300 rounded-md z-50">
                                    <SketchPicker
                                        color={textColor}
                                        onChange={handleChange}
                                        disableAlpha={false} // 투명도 조절 활성화
                                        // 미리 선택할 수 있는 색상 리스트
                                        presetColors={[
                                            '#D0021B', '#F5A623', '#F8E71C', '#8B572A',
                                            '#7ED321', '#417505', '#BD10E0', '#9013FE',
                                            '#4A90E2', '#50E3C2', '#B8E986', '#000000',
                                            '#444444', '#9B9B9B', '#FFFFFF'
                                        ]}
                                        width="230px" // 픽커의 전체 너비
                                        styles={{
                                            default: {
                                                picker: {
                                                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                                    borderRadius: '5px',
                                                },
                                                saturation: {
                                                    borderRadius: '4px',
                                                    marginBottom: '5px'
                                                },
                                                color: {
                                                    width: '25px',
                                                    height: '25px',
                                                    borderRadius: '4px',
                                                    marginRight: '0',
                                                    marginBottom: '5px'
                                                },
                                            },
                                        }} />
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    );
}