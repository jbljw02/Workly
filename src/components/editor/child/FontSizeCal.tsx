import { Editor } from "@tiptap/react";
import ToolbarButton from "./ToolbarButton";
import PlusIcon from '../../../../public/svgs/editor/plus.svg';
import MinusIcon from '../../../../public/svgs/editor/minus.svg';

type FontSizeCal = {
    editor: Editor;
    fontSize: number;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function FontSizeCal({ editor, fontSize, setFontSize }: FontSizeCal) {
    // 폰트 크기 조절
    const increaseFontSize = () => {
        const newSize = fontSize + 1;
        setFontSize(newSize);
        (editor.chain() as any).focus().setFontSize(`${newSize}px`).run();
    }
    const decreaseFontSize = () => {
        const newSize = fontSize - 1;
        setFontSize(newSize);
        (editor.chain() as any).setFontSize(`${newSize}px`).run();
    }
    const fontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newSize = parseInt(value, 10);
        setFontSize(newSize);
        (editor.chain() as any).setFontSize(`${newSize}px`).run();
    }

    return (
        <div className="flex items-center">
            <div className="-ml-2 mr-1">
                <ToolbarButton
                    onClick={decreaseFontSize}
                    Icon={MinusIcon}
                    iconWidth={20} />
            </div>
            <input
                type="number"
                value={fontSize}
                onChange={fontSizeChange}
                className="w-8 p-0.5 text-center border rounded-sm border-gray-300 text-sm" />
            <div className="ml-1 -mr-2">
                <ToolbarButton
                    onClick={increaseFontSize}
                    Icon={PlusIcon}
                    iconWidth={11} />
            </div>
        </div>
    )
}