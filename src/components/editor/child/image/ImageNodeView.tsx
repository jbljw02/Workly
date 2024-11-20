import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useClickOutside } from '@/components/hooks/useClickOutside';
import ImageMenuBar from './ImageMenuBar';
import ImageCropper from './ImageCropper';
import ImageCropBar from './ImageCropBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCrop, setImageDimension, setOpenFullModal } from '@/redux/features/editorImageSlice';
import uploadImage from '@/utils/image/uploadImageToStorage';
import cropImage from '@/utils/image/cropImage';
import { showWarningAlert } from '@/redux/features/alertSlice';
import ImageFullModal from './ImageFullModal';
import useCheckSelected from '@/components/hooks/useCheckSelected';
import { SetResizableImageProps } from '../../../../../lib/ImageNode';

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();
  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');
  const [isSelected, setIsSelected] = useState(false);

  const crop = useAppSelector(state => state.crop);
  const [cropMode, setCropMode] = useState(false);

  const openFullModal = useAppSelector(state => state.openFullModal);
  const webPublished = useAppSelector(state => state.webPublished);
  const editorPermission = useAppSelector(state => state.editorPermission);

  const nodeViewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // 자르기 시작
  const cropStart = () => {
    if (resizableImgProps.node.attrs.width && resizableImgProps.node.attrs.height) {
      // crop 상태를 이미지 전체 크기로 초기화
      dispatch(setCrop({
        unit: 'px',
        x: 0,
        y: 0,
        width: resizableImgProps.node.attrs.width,
        height: resizableImgProps.node.attrs.height
      }));
      setShowMenu(false);
      setCropMode(true);
    };
  }

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
        const img = new Image();
        img.crossOrigin = "anonymous"; // 파이어베이스 스토리에 저장하기 위해 cors 설정

        img.onload = async () => {
          ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const croppedImage = canvas.toDataURL('image/jpeg', 1.0);

          // editor 내부에서 이미지 자르기 적용
          editor.chain().focus().deleteSelection().run();
          (editor.commands.setResizableImage as SetResizableImageProps)({
            id: resizableImgProps.node.attrs.id,
            src: croppedImage,
            alt: resizableImgProps.node.attrs.alt || '',
            title: resizableImgProps.node.attrs.title || '',
            width: crop.width,
            height: crop.height,
            className: 'resizable-img',
            'data-keep-ratio': true,
            textAlign: resizableImgProps.node.attrs.textAlign,
          });

          setCropMode(false);

          try {
            await cropImage({
              id: resizableImgProps.node.attrs.id,
              src: croppedImage,
              alt: resizableImgProps.node.attrs.alt || '',
              title: resizableImgProps.node.attrs.title || '',
              width: String(crop.width),
              height: String(crop.height),
              className: 'resizable-img',
              'data-keep-ratio': true,
              textAlign: resizableImgProps.node.attrs.textAlign,
            });
          } catch (error) {
            dispatch(showWarningAlert('이미지를 자르지 못했습니다.'));
          }

        };
        img.src = imgRef.current.src;
      }
    }
  };

  // ESC를 누르면 자르기 작업 취소
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCropMode(false);
      }
    };

    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, [cropMode]);

  // 이미지의 크기가 변경되면 스토리지에 업데이트
  useEffect(() => {
    if (resizableImgProps.node.attrs.width &&
      resizableImgProps.node.attrs.height &&
      resizableImgProps.node.attrs.src &&
      resizableImgProps.node.attrs.title &&
      resizableImgProps.node.attrs.className) {
      uploadImage({
        id: resizableImgProps.node.attrs.id,
        src: resizableImgProps.node.attrs.src,
        alt: resizableImgProps.node.attrs.alt || '',
        title: resizableImgProps.node.attrs.title,
        width: String(resizableImgProps.node.attrs.width),
        height: String(resizableImgProps.node.attrs.height),
        className: resizableImgProps.node.attrs.className,
        'data-keep-ratio': true,
        textAlign: resizableImgProps.node.attrs.textAlign,
      });
    }
  }, [resizableImgProps.node.attrs.width, resizableImgProps.node.attrs.height]);

  // 이미지 크기가 변경되면 자르기 영역 크기 업데이트
  useEffect(() => {
    if (nodeViewRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;

        // 자르기 영역의 크기를 동일하게 업데이트
        dispatch(setCrop({
          unit: 'px',
          x: 0,
          y: 0,
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

  useClickOutside(nodeViewRef, () => {
    if (!openFullModal) {
      if (cropMode) {
        setCropMode(false);
      } else {
        setShowMenu(false);
      }
    }
  });

  useCheckSelected({ editor, node: resizableImgProps.node, setIsSelected });

  return (
    <>
      <NodeViewWrapper
        ref={nodeViewRef}
        as="figure"
        className="image-component z-0"
        data-drag-handle
        style={{ justifyContent: alignment }}
        contentEditable={false}
        draggable={true}>
        {
          // 이미지 자르기 모드
          cropMode ? (
            <ImageCropper
              imgRef={imgRef}
              resizableImgProps={resizableImgProps} />
          ) :
            (
              <div
                onClick={
                  () => (webPublished || editorPermission === '읽기 허용') ?
                    dispatch(setOpenFullModal(true)) :
                    setShowMenu(true)
                }
                ref={imgRef}
                className="cursor-pointer inline-flex">
                <ResizableImageComponent {...resizableImgProps} />
              </div>
            )
        }
        {/* 이미지를 이용해 여러 작업을 하는 메뉴바 */}
        {/* 게시된 문서를 열람중이 아니고, 권한이 읽기 허용보다 높을 때만 */}
        {
          (
            !cropMode &&
            !webPublished &&
            (editorPermission === '전체 허용' || editorPermission === '쓰기 허용')) && (
            <ImageMenuBar
              nodeViewRef={nodeViewRef}
              cropStart={cropStart}
              resizableImgProps={resizableImgProps}
              setShowMenu={setShowMenu}
              isSelected={isSelected} />
          )
        }
        {
          cropMode && (
            <ImageCropBar
              cropApply={cropApply}
              cropCancel={cropCancel} />
          )
        }
      </NodeViewWrapper>
      <ImageFullModal resizableImgProps={resizableImgProps} />
    </>
  );
};

const ImageNodeView = ResizableImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
      },
      textAlign: {
        default: 'left',
      },
    };
  },

  group: 'block',
  inline: false,
  draggable: true,

  addNodeView() {
    return ReactNodeViewRenderer(NodeView as React.ComponentType<any>);
  },
});

export default ImageNodeView;