import { getStorage, ref, getMetadata, updateMetadata, uploadString, getDownloadURL } from "firebase/storage";
import { ImageAttrs } from '../../../lib/ImageNode';

// 이미지 자르기 후 업로드
const cropImage = async (imageAttrs: ImageAttrs) => {
    const storage = getStorage();

    const imageRef = ref(storage, `images/${imageAttrs.id}`);

    // 추가될 이미지의 메타데이터
    const currentMetadata = {
        id: imageAttrs.id,
        width: imageAttrs.width,
        height: imageAttrs.height,
        alt: imageAttrs.alt,
        title: imageAttrs.title,
        textAlign: imageAttrs.textAlign,
    };

    await uploadString(imageRef, imageAttrs.src, 'data_url');
    await updateMetadata(imageRef, { customMetadata: currentMetadata });
}

export default cropImage;