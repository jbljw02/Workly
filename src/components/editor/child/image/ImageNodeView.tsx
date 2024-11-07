import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
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

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();
  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');

  const crop = useAppSelector(state => state.crop);
  const [cropMode, setCropMode] = useState(false);

  const openFullModal = useAppSelector(state => state.openFullModal);
  const webPublished = useAppSelector(state => state.webPublished);
  const editorPermission = useAppSelector(state => state.editorPermission);

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
          editor.commands.setResizableImage({
            src: croppedImage,
            alt: '',
            title: '',
            width: crop.width,
            height: crop.height,
            className: 'resizable-img',
            'data-keep-ratio': true,
          });

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

          setCropMode(false);
        };
        img.src = imgRef.current.src;
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

  return (
    <>
      <NodeViewWrapper
        ref={nodeViewRef}
        as="figure"
        className="relative image-component"
        data-drag-handle
        style={{ justifyContent: alignment }}
        contentEditable={false}
        draggable={true}>
        <div
          // 문서가 게시중이거나 권한이 읽기 허용일 땐 클릭 시 즉시 전체화면
          onClick={
            () => (webPublished || editorPermission === '읽기 허용') &&
              dispatch(setOpenFullModal(true))
          }
          className="inline-flex flex-col items-center relative h-auto">
          {
            // 이미지 자르기 모드
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
          {/* 이미지를 이용해 여러 작업을 하는 메뉴바 */}
          {/* 게시된 문서를 열람중이 아니고, 권한이 읽기 허용보다 높을 때만 */}
          {
            (
              showMenu &&
              !cropMode &&
              !webPublished &&
              (editorPermission === '전체 허용' || editorPermission === '쓰기 허용')) && (
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

  renderHTML({ HTMLAttributes }) {
    return ['figure', { class: 'image-component' }, ['img', HTMLAttributes]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeView as React.ComponentType<any>);
  },

});

export default ImageNodeView;