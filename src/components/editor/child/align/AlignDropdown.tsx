import ToolbarButton from "../../../button/ToolbarButton";
import AlignLeftIcon from '../../../../../public/svgs/editor/align-left.svg'
import AlignRightIcon from '../../../../../public/svgs/editor/align-right.svg'
import AlignCenterIcon from '../../../../../public/svgs/editor/align-center.svg'
import { Editor } from '@tiptap/react'
import { useClickOutside } from "@/components/hooks/useClickOutside";

type AlignDropdown = {
    editor: Editor;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    alignRef: React.RefObject<HTMLDivElement>;
}

export default function AlignDropdown({ editor, setIsOpen, isOpen, alignRef }: AlignDropdown) {
    // 정렬 드롭다운 컨트롤
    const setAlignment = (alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run();
        setIsOpen(false);
    }

    useClickOutside(alignRef, () => setIsOpen(false));

    return (
        <div
            className={`flex flex-row absolute top-10 left-0 bg-white border rounded-sm border-gray-200 shadow-lg z-20
                transition-opacity duration-200 ease-in-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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