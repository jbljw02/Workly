import { RefObject, useRef, useState } from "react";
import BarDivider from "../divider/VerticalDivider";
import HoverTooltip from "../../../tooltip/HoverTooltip";
import ToolbarButton from "../../../button/ToolbarButton";
import AlignLeftIcon from '../../../../../public/svgs/editor/align-left.svg';
import AlignCenterIcon from '../../../../../public/svgs/editor/align-center.svg';
import AlignRightIcon from '../../../../../public/svgs/editor/align-right.svg';
import CropIcon from '../../../../../public/svgs/editor/crop.svg';
import TrashIcon from '../../../../../public/svgs/trash.svg';
import FullIcon from '../../../../../public/svgs/editor/full-screen.svg';
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOpenFullModal } from "@/redux/features/editorImageSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { deleteObject, getStorage, ref } from "firebase/storage";
import ImageFullModal from "./ImageFullModal";

type ImageMenuBarProps = {
    nodeViewRef: RefObject<HTMLDivElement>;
    cropStart: () => void;
    resizableImgProps: ResizableImageNodeViewRendererProps;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    isSelected: boolean;
}

export default function ImageMenuBar({ nodeViewRef, cropStart, resizableImgProps, setShowMenu, isSelected }: ImageMenuBarProps) {
    const dispatch = useAppDispatch();
    const editor = resizableImgProps.editor;

    console.log('isSelected : ', isSelected)

    const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');

    console.log('ㅁㅁㅁ : ', resizableImgProps.node)


    const alignmentSetUp = (justifyContent: 'flex-start' | 'center' | 'flex-end') => {
        const imgContainer = nodeViewRef.current?.closest('.node-imageComponent') as HTMLElement;
        if (imgContainer) {
            imgContainer.style.justifyContent = justifyContent;
            setAlignment(justifyContent);
        }
    };

    const deleteImage = async (id: string) => {
        try {
            // 스토리지 내부 이미지 삭제
            const storage = getStorage();
            const imageRef = ref(storage, `images/${id}`);

            await deleteObject(imageRef);

            // 에디터에서 이미지 삭제
            editor.chain().focus().deleteSelection().run();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={`flex flex-row items-center absolute bottom-[-48px] right-[-5px] font-normal rounded-md p-1 z-[10] bg-white border border-gray-200 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]
            transition-opacity duration-200 ease-in-out
            ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-row items-center gap-0.5">
                <HoverTooltip label="좌측 정렬">
                    <ToolbarButton
                        onClick={() => alignmentSetUp('flex-start')}
                        isActive={alignment === 'flex-start'}
                        Icon={AlignLeftIcon}
                        iconWidth={19} />
                </HoverTooltip>
                <HoverTooltip label="중앙 정렬">
                    <ToolbarButton
                        onClick={() => alignmentSetUp('center')}
                        isActive={alignment === 'center'}
                        Icon={AlignCenterIcon}
                        iconWidth={19} />
                </HoverTooltip>
                <HoverTooltip label='우측 정렬'>
                    <ToolbarButton
                        onClick={() => alignmentSetUp('flex-end')}
                        isActive={alignment === 'flex-end'}
                        Icon={AlignRightIcon}
                        iconWidth={19} />
                </HoverTooltip>
            </div>
            <BarDivider />
            <div className="flex flex-row items-center gap-0.5">
                <HoverTooltip label='자르기'>
                    <ToolbarButton
                        Icon={CropIcon}
                        iconWidth={17}
                        onClick={cropStart} />
                </HoverTooltip>
                <HoverTooltip label='삭제'>
                    <ToolbarButton
                        Icon={TrashIcon}
                        iconWidth={19}
                        onClick={() => deleteImage(resizableImgProps.node.attrs.id)} />
                </HoverTooltip>
                <HoverTooltip label='펼치기'>
                    <ToolbarButton
                        Icon={FullIcon}
                        iconWidth={21}
                        onClick={() => dispatch(setOpenFullModal(true))} />
                </HoverTooltip>
                {
                    isSelected && <ImageFullModal resizableImgProps={resizableImgProps} />
                }
            </div>
        </div>
    )
}
