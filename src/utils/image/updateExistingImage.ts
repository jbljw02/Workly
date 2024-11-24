import { getStorage, ref, updateMetadata, getMetadata } from "firebase/storage";
import { ImageAttrs } from "../../../lib/ImageNode";

const updateExistingImage = async (imageAttrs: ImageAttrs) => {
    const storage = getStorage();
    const imageRef = ref(storage, `images/${imageAttrs.id}`);

    const newMetadata = {
        id: imageAttrs.id,
        width: imageAttrs.width,
        height: imageAttrs.height,
        alt: imageAttrs.alt,
        title: imageAttrs.title,
        textAlign: imageAttrs.textAlign,
    };

    // 이미지 메타데이터가 없으면 업데이트 중단
    try {
        await getMetadata(imageRef);
    } catch {
        return;
    }

    await updateMetadata(imageRef, { customMetadata: newMetadata });
}

export default updateExistingImage;