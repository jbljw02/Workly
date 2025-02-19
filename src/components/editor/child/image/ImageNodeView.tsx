import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage, ResizableImageComponent, ResizableImageNodeViewRendererProps } from 'tiptap-extension-resizable-image';
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import ImageMenuBar from './ImageMenuBar';
import ImageCropper from './ImageCropper';
import ImageCropBar from './ImageCropBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCrop, setOpenFullModal } from '@/redux/features/editor/editorImageSlice';
import { showWarningAlert } from '@/redux/features/common/alertSlice';
import useCheckSelected from '@/hooks/editor/useCheckSelected';
import { SetResizableImageProps } from '../../../../lib/ImageNode';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import { setWorkingSpinner } from '@/redux/features/common/placeholderSlice';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const NodeView = (resizableImgProps: ResizableImageNodeViewRendererProps) => {
  const dispatch = useAppDispatch();
  const editor = resizableImgProps.editor;

  const [showMenu, setShowMenu] = useState(false); // 이미지 메뉴바를 보여줄지
  const [alignment, setAlignment] = useState<'flex-start' | 'center' | 'flex-end'>('flex-start');
  const [isSelected, setIsSelected] = useState(false);

  const crop = useAppSelector(state => state.crop);
  const [cropMode, setCropMode] = useState(false);

  const selectedDocument = useAppSelector(state => state.selectedDocument);
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
      dispatch(setWorkingSpinner(true));

      // 이미지를 자르기 위한 캔버스 생성
      const canvas = document.createElement('canvas');

      // 실제 이미지와 화면에 표시된 이미지 사이의 비율 계산
      // naturalWidth/Height: 이미지 원본 크기
      // width/height: 화면에 표시된 크기
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      // 자를 영역의 크기를 실제 이미지 크기에 맞게 조정
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      // 캔버스 2D 컨텍스트 가져오기
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 새로운 이미지 객체 생성
        const img = new Image();
        // Firebase Storage에 업로드하기 위해 CORS 설정
        img.crossOrigin = "anonymous";

        // 이미지 로드 완료 시 실행될 콜백
        img.onload = async () => {
          // drawImage(이미지, 
          //    원본 이미지에서 자를 x좌표, y좌표, 너비, 높이,
          //    캔버스에 그릴 x좌표, y좌표, 너비, 높이)
          ctx.drawImage(
            img,
            crop.x * scaleX, // 자를 영역의 시작 x좌표
            crop.y * scaleY, // 자를 영역의 시작 y좌표
            crop.width * scaleX, // 자를 영역의 너비
            crop.height * scaleY, // 자를 영역의 높이
            0, // 캔버스에 그릴 x좌표
            0, // 캔버스에 그릴 y좌표
            canvas.width, // 캔버스에 그릴 너비
            canvas.height, // 캔버스에 그릴 높이
          );

          try {
            // Canvas를 Blob으로 변환
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                resolve(blob!);
              }, 'image/jpeg', 1.0);
            });

            // 자른 이미지를 스토리지에 업로드하고 URL 가져오기
            const storage = getStorage();
            const newImageId = uuidv4();
            const imageRef = ref(storage, `documents/${selectedDocument.id}/images/${newImageId}`);

            await uploadBytes(imageRef, blob);
            const url = await getDownloadURL(imageRef);

            // 원본 이미지 삭제
            const oldImageRef = ref(storage, `documents/${selectedDocument.id}/images/${resizableImgProps.node.attrs.id}`);
            await deleteObject(oldImageRef).catch(() => { }); // 에러 무시

            // editor 내부에서 이미지 자르기 적용
            editor.chain().focus().deleteSelection().run();
            (editor.commands.setResizableImage as SetResizableImageProps)({
              id: newImageId, // 새로운 ID 사용
              src: url,
              alt: resizableImgProps.node.attrs.alt || '',
              title: resizableImgProps.node.attrs.title || '',
              width: crop.width,
              height: crop.height,
              className: 'resizable-img',
              'data-keep-ratio': true,
              textAlign: resizableImgProps.node.attrs.textAlign,
            });
          } catch (error) {
            dispatch(showWarningAlert('이미지 자르기에 실패했습니다.'));
          } finally {
            dispatch(setWorkingSpinner(false));
            setCropMode(false);
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
    <NodeViewWrapper
      ref={nodeViewRef}
      as="figure"
      className="image-component z-0"
      data-drag-handle
      style={{ justifyContent: alignment }}
      contentEditable={false}
      draggable={true}>
      {
        // 자르기 모드
        cropMode ? (
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
      {/* 게시된 문서를 열람중이 아니고, 권한이 읽기 허용보다 높을 때만 */}
      {
        (
          !cropMode &&
          (editorPermission === '전체 허용' || editorPermission === '쓰기 허용')) && (
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
          cropMode={cropMode}
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