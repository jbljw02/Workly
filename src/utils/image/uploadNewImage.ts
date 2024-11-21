import { uploadString, updateMetadata, getStorage, ref } from "firebase/storage";
import {  SetResizableImageProps } from "../../../lib/ImageNode";
import getDimensions from "./getDimensions";
import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';

const uploadNewImage = async (editor: Editor, title: string, src: string) => {
    const dimensions = await getDimensions(src); // 이미지 크기 계산

    const imageAttrs = {
        id: uuidv4(),
        src: src,
        title: title,
        width: dimensions.width,
        height: dimensions.height,
        className: 'resizable-img',
        'data-keep-ratio': true,
        textAlign: 'left',
        alt: '',
    };

    (editor.commands.setResizableImage as SetResizableImageProps)(imageAttrs);

    // 스토리지에는 너비와 높이를 문자열로 저장
    const storageImageAttrs = {
        ...imageAttrs,
        width: String(imageAttrs.width),
        height: String(imageAttrs.height),
    }

    const storage = getStorage();
    const imageRef = ref(storage, `images/${storageImageAttrs.id}`);

    const metadata = {
        id: storageImageAttrs.id,
        width: storageImageAttrs.width,
        height: storageImageAttrs.height,
        alt: storageImageAttrs.alt,
        title: storageImageAttrs.title,
        textAlign: storageImageAttrs.textAlign,
    };

    await uploadString(imageRef, imageAttrs.src, 'data_url'); // 이미지 업로드
    await updateMetadata(imageRef, { customMetadata: metadata }); // 메타데이터 업데이트
};

export default uploadNewImage;