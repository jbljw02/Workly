import AlignDropdown from "./AlignDropdown";
import HoverTooltip from "../../../tooltip/HoverTooltip";
import ToolbarButton from "../../../button/ToolbarButton";
import AlignLeftIcon from '../../../../../public/svgs/editor/align-left.svg'
import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";

type ManageAlignProps = {
    editor: Editor;
}

export default function ManageAlign({ editor }: ManageAlignProps) {
    const alignRef = useRef<HTMLDivElement>(null);

    const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);

    return (
        <div
            className="relative"
            ref={alignRef}>
            <HoverTooltip label='정렬'>
                <ToolbarButton
                    onClick={() => setAlignDropdownOpen(!alignDropdownOpen)}
                    Icon={AlignLeftIcon}
                    iconWidth={21} />
            </HoverTooltip>
            <AlignDropdown
                editor={editor}
                isOpen={alignDropdownOpen}
                setIsOpen={setAlignDropdownOpen}
                alignRef={alignRef} />
        </div>
    )
}