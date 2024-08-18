import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useRef, useState } from 'react';
import ToolbarButton from './ToolbarButton';
import BarDivider from './BarDivider';
import AlignLeftIcon from '../../../../public/svgs/editor/align-left.svg';
import AlignCenterIcon from '../../../../public/svgs/editor/align-center.svg';
import AlignRightIcon from '../../../../public/svgs/editor/align-right.svg';
import CropIcon from '../../../../public/svgs/editor/crop.svg';
import TrashIcon from '../../../../public/svgs/trash.svg';
import FullIcon from '../../../../public/svgs/editor/full-screen.svg';
import CaptionIcon from '../../../../public/svgs/editor/comment.svg';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import HoverTooltip from './HoverTooltip';

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [alignment, setAlignmentState] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setAlignment = (justifyContent: 'flex-start' | 'center' | 'flex-end') => {
    // 이미지의 최상위 요소인 .node-imageComponent를 찾음
    const imgContainer = dropdownRef.current?.closest('.node-imageComponent') as HTMLElement;

    if (imgContainer) {
      imgContainer.style.justifyContent = justifyContent;
      setAlignmentState(justifyContent);
    }
  };

  const imageClick = () => {
    setShowMenu((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setShowMenu(false));

  return (
    <NodeViewWrapper
      ref={dropdownRef}
      className="relative image-component"
      data-drag-handle>
      <div className="inline-flex flex-col items-center relative">
        <div onClick={imageClick} className="flex cursor-pointer">
          <ResizableImageComponent {...props} />
        </div>
        {
          showMenu && (
            <div className='flex flex-row items-center absolute bottom-[-55px] left-[-5px] rounded-md p-1 z-[9999] bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.25)]'>
              <HoverTooltip label="좌측 정렬">
                <ToolbarButton
                  onClick={() => setAlignment('flex-start')}
                  isActive={alignment === 'flex-start'}
                  Icon={AlignLeftIcon}
                  iconWidth={19} />
              </HoverTooltip>
              <HoverTooltip label="중앙 정렬">
                <ToolbarButton
                  onClick={() => setAlignment('center')}
                  isActive={alignment === 'center'}
                  Icon={AlignCenterIcon}
                  iconWidth={19} />
              </HoverTooltip>
              <HoverTooltip label='우측 정렬'>
                <ToolbarButton
                  onClick={() => setAlignment('flex-end')}
                  isActive={alignment === 'flex-end'}
                  Icon={AlignRightIcon}
                  iconWidth={19} />
              </HoverTooltip>
              <BarDivider />
              <HoverTooltip label='자르기'>
                <ToolbarButton
                  Icon={CropIcon}
                  iconWidth={17} />
              </HoverTooltip>
              <HoverTooltip label='삭제'>
                <ToolbarButton
                  Icon={TrashIcon}
                  iconWidth={14} />
              </HoverTooltip>
              <HoverTooltip label='펼치기'>
                <ToolbarButton
                  Icon={FullIcon}
                  iconWidth={21} />
              </HoverTooltip>
              <HoverTooltip label='설명 추가'>
                <ToolbarButton
                  Icon={CaptionIcon}
                  iconWidth={25} />
              </HoverTooltip>
            </div>
          )
        }
      </div>
    </NodeViewWrapper>
  );
};

const ImageClickMenu = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeView);
  },
});

export default ImageClickMenu;
