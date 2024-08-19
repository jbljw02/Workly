import { RefObject, SetStateAction } from "react";
import ReactCrop, { PixelCrop } from "react-image-crop";
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";

type ImageCropper = {
    crop: PixelCrop;
    setCrop: React.Dispatch<React.SetStateAction<PixelCrop>>;
    imageDimension: {
        width: number,
        height: number,
    };
    imgRef: RefObject<HTMLImageElement>;
    resizableImgProps: ResizableImageNodeViewRendererProps;
}

export default function ImageCropper({ crop, setCrop, imageDimension, imgRef, resizableImgProps }: ImageCropper) {
    return (
        <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
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