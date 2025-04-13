import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import ImageMenuBar from './ImageMenuBar';
import ImageCropper from './ImageCropper';
import ImageCropBar from './ImageCropBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCropMode, setOpenFullModal } from '@/redux/features/editor/editorImageSlice';
import useCheckSelected from '@/hooks/editor/useCheckSelected';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import useCheckDemo from '@/hooks/demo/useCheckDemo';
import useImageCrop from '@/hooks/editor/useImageCrop';

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();
  const checkDemo = useCheckDemo();

  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');
  const [isSelected, setIsSelected] = useState(false);

  const cropMode = useAppSelector(state => state.cropMode);
  const openFullModal = useAppSelector(state => state.openFullModal);
  const webPublished = useAppSelector(state => state.webPublished);
  const editorPermission = useAppSelector(state => state.editorPermission);

  const nodeViewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { cropStart, cropCancel, cropApply } = useImageCrop(
    resizableImgProps,
    nodeViewRef,
    imgRef,
    setShowMenu
  );

  useClickOutside(nodeViewRef, () => {
    if (!openFullModal) {
      if (cropMode.isActive) {
        dispatch(setCropMode({
          isActive: false,
          imageId: null
        }));
      } else {
        setShowMenu(false);
      }
    }
  });

  useCheckSelected({ editor, node: resizableImgProps.node, setIsSelected });

  return (
    <NodeViewWrapper
      ref={nodeViewRef}
      as="figure"
      className="image-component z-0 mr-7"
      data-drag-handle
      style={{ justifyContent: alignment }}
      contentEditable={false}
      draggable={true}>
      {
        // 자르기 모드 활성화
        cropMode.isActive &&
          cropMode.imageId === resizableImgProps.node.attrs.id ? (
          <ImageCropper
            imgRef={imgRef}
            resizableImgProps={resizableImgProps} />
        ) :
          (
            <>
              {/* 수정이 불가능한 권한일 경우 즉시 펼치기 */}
              <div onClick={() => (webPublished || editorPermission === '읽기 허용') ?
                dispatch(setOpenFullModal(true)) :
                setShowMenu(true)}
                ref={imgRef}
                className="cursor-pointer inline-flex">
                <ResizableImageComponent {...resizableImgProps} />
              </div>
              {/* 이미지가 업로드 중일 때 로딩 스피너 표시 */}
              {
                resizableImgProps.node.attrs.className?.includes('uploading') &&
                (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <LoadingSpinner size={60} color="#ffffff" />
                  </div>
                )
              }
            </>
          )
      }
      {/* 이미지를 이용해 여러 작업을 하는 메뉴바 */}
      {/* 게시된 문서를 열람중이 아니며, 권한이 읽기 허용보다 높을 때 및 데모 모드일 때 */}
      {
        !cropMode.isActive &&
        (editorPermission === '전체 허용' || editorPermission === '쓰기 허용' || checkDemo()) && (
          <ImageMenuBar
            nodeViewRef={nodeViewRef}
            cropStart={cropStart}
            resizableImgProps={resizableImgProps}
            setShowMenu={setShowMenu}
            isSelected={!resizableImgProps.node.attrs.className?.includes('uploading') && isSelected} />
        )
      }
      {
        // 자르기 모드일 때 바 표시
        <ImageCropBar
          id={resizableImgProps.node.attrs.id}
          cropApply={cropApply}
          cropCancel={cropCancel} />
      }
    </NodeViewWrapper>
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