import { Editor } from '@tiptap/react';
import { v4 as uuidv4 } from 'uuid';
import uploadImageToStorage from './image/uploadImageToStorage';
import { SetResizableImageProps } from '../../lib/ImageNode';

const getDimensions = (src: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve) => {
        // 새로운 Image 객체 생성
        const img = new Image();
        
        // 이미지가 로드되면 실행
        img.onload = () => {
            // 이미지의 최대 너비 설정(600px)
            const maxWidth = 600;
            // 원본 이미지의 너비와 높이
            let width = img.width;
            let height = img.height;
            
            // 이미지 너비가 최대 너비보다 큰 경우 크기 조정
            if (width > maxWidth) {
                // 비율 계산(maxWidth / 원본 너비)
                const ratio = maxWidth / width;
                // 너비를 최대 너비로 설정
                width = maxWidth;
                // 높이를 비율에 맞게 조정(반올림 처리)
                height = Math.round(height * ratio);
            }
            
            // 계산된 너비와 높이를 반환
            resolve({ width, height });
        };
        
        // 이미지 소스 설정하여 로드 시작
        img.src = src;
    });
};

const uploadImage = async (editor: Editor, file: File, src: string) => {
    // 이미지 크기 계산
    const dimensions = await getDimensions(src);

    const imgAttrs = {
        id: uuidv4(),
        src: src,
        alt: '',
        title: file.name,   
        width: String(dimensions.width),
        height: String(dimensions.height),
        'data-keep-ratio': true,
        className: 'resizable-img',
        textAlign: 'left',
    };

    (editor.commands.setResizableImage as SetResizableImageProps)({
        id: imgAttrs.id,
        src: imgAttrs.src,
        alt: imgAttrs.alt,
        title: imgAttrs.title,
        width: dimensions.width,
        height: dimensions.height,
        'data-keep-ratio': true,
        className: 'resizable-img',
        textAlign: 'left',
    })

    await uploadImageToStorage(imgAttrs);
}

export default uploadImage;