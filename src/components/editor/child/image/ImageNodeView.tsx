import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import ImageMenuBar from './ImageMenuBar';
import ImageCropper from './ImageCropper';
import ImageCropBar from './ImageCropBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCrop, setImageDimension } from '@/redux/features/editorImageSlice';
import DragHandle from '@tiptap-pro/extension-drag-handle-react';

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();
  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');

  const crop = useAppSelector(state => state.crop);
  const [cropMode, setCropMode] = useState(false);

  const openFullModal = useAppSelector(state => state.openFullModal);

  const nodeViewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // 자르기 시작
  const cropStart = () => {
    setShowMenu(false);
    setCropMode(true);
  };

  // 자르기 취소
  const cropCancel = () => {
    setShowMenu(true);
    setCropMode(false);
  };

  // 자르기 적용
  const cropApply = () => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const base64Image = canvas.toDataURL('image/jpeg', 1.0);
        editor.chain().focus().deleteSelection().run();
        editor.commands.setResizableImage({
          src: base64Image,
          alt: '',
          title: '',
          width: crop.width,
          height: crop.height,
          className: 'resizable-img',
          'data-keep-ratio': true,
        });
        setCropMode(false);
      }
    }
  };

  // 요소 바깥을 클릭하면 이미지 메뉴바를 닫고, 자르기 작업 취소
  useClickOutside(nodeViewRef, () => {
    if (!openFullModal) {
      if (cropMode) {
        setCropMode(false);
      } else {
        setShowMenu(false);
      }
    }
  });

  // ESC를 누르면 자르기 작업 취소
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCropMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cropMode]);

  // 이미지의 크기 변화를 감지하여 Crop 요소들의 값을 업데이트
  useEffect(() => {
    if (nodeViewRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        dispatch(setImageDimension({
          width: width,
          height: height,
        }));
        dispatch(setCrop({
          ...crop,
          width: width,
          height: height,
        }));
      });

      resizeObserver.observe(nodeViewRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <NodeViewWrapper
      ref={nodeViewRef}
      as="figure"
      className="relative image-component flex"
      data-drag-handle
      style={{ justifyContent: alignment }}
      draggable={true}>
      <div className="inline-flex flex-col items-center relative node-imageComponent">
        {
          cropMode ? (
            <ImageCropper
              imgRef={imgRef}
              resizableImgProps={resizableImgProps} />
          ) :
            (

              <div
                onClick={() => setShowMenu(true)}
                className="flex cursor-pointer">
                <ResizableImageComponent {...resizableImgProps} />
              </div>
            )
        }
        {
          (showMenu && !cropMode) && (
            <ImageMenuBar
              nodeViewRef={nodeViewRef}
              cropStart={cropStart}
              resizableImgProps={resizableImgProps} />
          )
        }
        {
          cropMode && (
            <ImageCropBar
              cropApply={cropApply}
              cropCancel={cropCancel} />
          )
        }
      </div>
    </NodeViewWrapper>
  );
};

const ImageNodeView = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeView as React.ComponentType<any>);
  },
});

export default ImageNodeView;