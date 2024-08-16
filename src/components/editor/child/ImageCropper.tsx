import React, { useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ src, onComplete }: { src: string; onComplete: (croppedSrc: string) => void }) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%', 
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    });
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    const onImageLoad = (image: HTMLImageElement) => {
        setImageRef(image);
    };

    const onCropComplete = (crop: PixelCrop) => {
        if (imageRef && crop.width && crop.height) {
            const croppedUrl = getCroppedImg(imageRef, crop);
            onComplete(croppedUrl);
        }
    };

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width ? crop.width * scaleX : 0;
        canvas.height = crop.height ? crop.height * scaleY : 0;
        const ctx = canvas.getContext('2d');

        if (ctx && crop.x !== undefined && crop.y !== undefined && crop.width && crop.height) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY,
            );
        }

        return canvas.toDataURL('image/jpeg');
    };

    return (
        <ReactCrop crop={crop} onChange={newCrop => setCrop(newCrop)} onComplete={onCropComplete}>
            <img src={src} alt="Source" onLoad={(e) => onImageLoad(e.currentTarget)} />
        </ReactCrop>
    );
}

export default ImageCropper;
