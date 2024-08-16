import ToolbarButton from "./ToolbarButton";
import AlignLeftIcon from '../../../../public/svgs/editor/align-left.svg'
import AlignRightIcon from '../../../../public/svgs/editor/align-right.svg'
import AlignCenterIcon from '../../../../public/svgs/editor/align-center.svg'
import { Editor } from '@tiptap/react'
import { useRef } from "react";
import { useClickOutside } from "@/components/hooks/useClickOutside";

type AlignDropdown = {
    editor: Editor;
    setAlignDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AlignDropdown({ editor, setAlignDropdownOpen }: AlignDropdown) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 정렬 드롭다운 컨트롤
    const setAlignment = (alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setAlignDropdownOpen(false);
    }

    useClickOutside(dropdownRef, () => setAlignDropdownOpen(false));

    return (
        <div
            ref={dropdownRef}
            className="flex flex-row absolute top-10 left-0 bg-white border rounded-sm border-gray-200 shadow-lg z-50">
            <ToolbarButton
                onClick={() => setAlignment('left')}
                isActive={editor.isActive({ textAlign: 'left' })}
                Icon={AlignLeftIcon}
                iconWidth={19} />
            <ToolbarButton
                onClick={() => setAlignment('center')}
                isActive={editor.isActive({ textAlign: 'center' })}
                Icon={AlignCenterIcon}
                iconWidth={19} />
            <ToolbarButton
                onClick={() => setAlignment('right')}
                isActive={editor.isActive({ textAlign: 'right' })}
                Icon={AlignRightIcon}
                iconWidth={19} />
        </div>
    )
}