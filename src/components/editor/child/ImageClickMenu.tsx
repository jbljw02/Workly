import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useEffect, useRef, useState } from 'react';
import { PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import ImageMenuBar from './ImageMenuBar';
import ImageCropper from './ImageCropper';
import ImageCropBar from './ImageCropBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCrop, setImageDimension } from '@/redux/features/editorImageSlice';

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();

  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');

  // const [crop, setCrop] = useState<PixelCrop>(
  //   {
  //     unit: 'px',
  //     width: 0,
  //     height: 0,
  //     x: 0,
  //     y: 0
  //   }
  // );
  const crop = useAppSelector(state => state.crop);
  const [cropMode, setCropMode] = useState(false);
  // const [imageDimension, setImageDimension] = useState({ width: 600, height: 600 }); // ReactCrop 컴포넌트의 너비와 높이
  const imageDimension = useAppSelector(state => state.imageDimension);
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
  }

  // 자르기 적용
  const cropApply = () => {
    if (imgRef.current && crop.width && crop.height) {
      // canvas: 이미지 자르기 및 처리 작업에 사용
      const canvas = document.createElement('canvas');

      // 자르기 작업은 원본 이미지 기준으로 해야 하며, 이미지의 표시 크기가 원본과 다를 수 있음.
      // 이미지의 현재, 원본 크기의 비율을 구함
      // 이미지의 원본 너비 / 현재 DOM에서 보여지는 이미지의 너비
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      // canvas의 크기를 원본 해상도로 설정하여 해상도 손실을 최소화
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext('2d');

      // 자르기 영역에 해당하는 이미지를 그림
      if (ctx) {
        ctx.drawImage(
          imgRef.current, // 이미지를 그릴 요소
          crop.x * scaleX, // 자르기를 시작할 x 좌표
          crop.y * scaleY, // 자르기를 시작할 y 좌표
          crop.width * scaleX, // 원본 이미지에서 자를 너비
          crop.height * scaleY, // 원본 이미지에서 자를 높이
          0, // 이미지를 그리기 시작할 x 좌표
          0, // 이미지를 그리기 시작할 y 좌표
          canvas.width, // 캔버스에 그려질 이미지 너비
          canvas.height, // 캔버스에 그려질 이미지 높이
        );

        // 자른 이미지를 base64 포맷으로 변환
        const base64Image = canvas.toDataURL('image/jpeg', 1.0); // 1.0은 이미지의 품질을 최대화

        // 기존 이미지를 삭제
        editor.chain().focus().deleteSelection().run();

        // 자른 이미지를 삽입
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
      // DOM의 크기 변화를 감지. entries는 크기 변화를 감지한 모든 DOM을 뜻함.
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
      style={{ justifyContent: alignment }}>
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

const ImageClickMenu = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(NodeView);
  },
});

export default ImageClickMenu;
