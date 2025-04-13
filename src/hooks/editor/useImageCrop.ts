import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";
import { setCrop, setCropMode } from "@/redux/features/editor/editorImageSlice";
import { useEffect } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { SetResizableImageProps } from "@/lib/ImageNode";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import useCheckDemo from "../demo/useCheckDemo";
import uploadToStorage from "@/utils/editor/uploadToStorage";
import uploadNewImage from "@/utils/editor/uploadDemoFile";

export default function useImageCrop(
    imgProps: ResizableImageNodeViewRendererProps,
    nodeViewRef: React.RefObject<HTMLDivElement>,
    imgRef: React.RefObject<HTMLImageElement>,
    setShowMenu: (showMenu: boolean) => void,
) {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();
    const editor = imgProps.editor;

    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const crop = useAppSelector(state => state.crop);
    const cropMode = useAppSelector(state => state.cropMode);

    // 자르기 시작
    const cropStart = () => {
        if (imgProps.node.attrs.width && imgProps.node.attrs.height) {
            // crop 상태를 이미지 전체 크기로 초기화
            dispatch(setCrop({
                unit: 'px',
                x: 0,
                y: 0,
                width: imgProps.node.attrs.width,
                height: imgProps.node.attrs.height
            }));
            setShowMenu(false);
            dispatch(setCropMode({
                isActive: true,
                imageId: imgProps.node.attrs.id
            }));
        };
    }

    // 자르기 취소
    const cropCancel = () => {
        setShowMenu(true);
        dispatch(setCropMode({
            isActive: false,
            imageId: null
        }));
    };

    // 자르기 적용
    const cropApply = () => {
        if (!imgRef.current || !crop.width || !crop.height || !imgRef.current.naturalWidth || !imgRef.current.naturalHeight) {
            dispatch(showWarningAlert('이미지 자르기에 실패했습니다.'));
            return;
        }

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
                // 원본 이미지에서 자를 x좌표, y좌표, 너비, 높이,
                // 캔버스에 그릴 x좌표, y좌표, 너비, 높이)
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

                    const newImageId = uuidv4();

                    let url = '';
                    if (checkDemo()) {
                        url = await uploadNewImage(blob);
                    } else {
                        url = await uploadToStorage(blob, `documents/${selectedDocument.id}/images/${newImageId}`);

                        const storage = getStorage();

                        // 원본 이미지 삭제
                        const oldImageRef = ref(storage, `documents/${selectedDocument.id}/images/${imgProps.node.attrs.id}`);
                        await deleteObject(oldImageRef).catch(() => { });
                    }

                    // editor 내부에서 이미지 자르기 적용
                    editor.chain().focus().deleteSelection().run();
                    (editor.commands.setResizableImage as SetResizableImageProps)({
                        id: newImageId, // 새로운 ID 사용
                        src: url,
                        alt: imgProps.node.attrs.alt || '',
                        title: imgProps.node.attrs.title || '',
                        width: crop.width,
                        height: crop.height,
                        className: 'resizable-img',
                        'data-keep-ratio': true,
                        textAlign: imgProps.node.attrs.textAlign,
                    });
                } catch (error) {
                    dispatch(showWarningAlert('이미지 자르기에 실패했습니다.'));
                } finally {
                    dispatch(setWorkingSpinner(false));
                    dispatch(setCropMode({
                        isActive: false,
                        imageId: null
                    }));
                }
            };
            img.src = imgRef.current.src;
        }

    };

    // ESC를 누르면 자르기 작업 취소
    useEffect(() => {
        const keyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dispatch(setCropMode({
                    isActive: false,
                    imageId: null
                }));
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

    return { cropStart, cropCancel, cropApply }
}