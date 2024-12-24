import { setCrop } from "@/redux/features/editorImageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RefObject } from "react";
import ReactCrop from "react-image-crop";
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropper = {
    imgRef: RefObject<HTMLImageElement>;
    resizableImgProps: ResizableImageNodeViewRendererProps;
}

export default function ImageCropper({ imgRef, resizableImgProps }: ImageCropper) {
    const dispatch = useAppDispatch();
    const crop = useAppSelector(state => state.crop);

    return (
        <ReactCrop
            crop={{ ...crop, unit: 'px' }}
            style={{
                maxWidth: resizableImgProps.node.attrs.width,
                maxHeight: resizableImgProps.node.attrs.height,
            }}
            onChange={(newCrop) => dispatch(setCrop(newCrop))}>
            <img
                ref={imgRef}
                src={resizableImgProps.node.attrs.src}
                style={{
                    width: resizableImgProps.node.attrs.width,
                    height: resizableImgProps.node.attrs.height
                }} />
        </ReactCrop>
    )
}