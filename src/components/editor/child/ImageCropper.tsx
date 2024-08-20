import { setCrop } from "@/redux/features/editorImageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RefObject, SetStateAction } from "react";
import ReactCrop, { PixelCrop } from "react-image-crop";
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";

type ImageCropper = {
    imgRef: RefObject<HTMLImageElement>;
    resizableImgProps: ResizableImageNodeViewRendererProps;
}

export default function ImageCropper({ imgRef, resizableImgProps }: ImageCropper) {
    const dispatch = useAppDispatch();
    const crop = useAppSelector(state => state.crop);
    const imageDimension = useAppSelector(state => state.imageDimension);

    return (
        <ReactCrop
            crop={crop}
            onChange={(newCrop) => dispatch(setCrop(newCrop))}
            style={{
                maxWidth: `${imageDimension.width}px`,
                maxHeight: `${imageDimension.height}px`,
            }}>
            <img
                ref={imgRef}
                src={resizableImgProps.node.attrs.src}
                style={{
                    maxWidth: imageDimension.width,
                    maxHeight: imageDimension.height
                }} />
        </ReactCrop>
    )
}