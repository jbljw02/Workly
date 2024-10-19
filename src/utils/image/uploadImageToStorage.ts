import { getStorage, ref, getMetadata, updateMetadata, uploadString, getDownloadURL } from "firebase/storage";
import { ImageAttrs } from '../../../lib/ImageNode';

// 단일 이미지 업로드
export default async function uploadImageToStorage(imageAttrs: ImageAttrs) {
    const storage = getStorage();

    const imageRef = ref(storage, `images/${imageAttrs.id}`);
    const metadata = await getMetadata(imageRef).catch(() => null); // 메타데이터가 없으면 null 반환

    // 추가될 이미지의 메타데이터
    const currentMetadata = {
        id: imageAttrs.id,
        width: imageAttrs.width,
        height: imageAttrs.height,
        alt: imageAttrs.alt,
        title: imageAttrs.title,
        textAlign: imageAttrs.textAlign,
    };

    if (metadata) {
        // 메타데이터 변경 필요 여부 확인
        // 변경된 값이 하나라도 있다면 이미지의 값이 변경되었다는 의미이므로, true 반환
        const needsUpdate = Object.keys(currentMetadata).some(key =>
            metadata.customMetadata?.[key] !== currentMetadata[key as keyof typeof currentMetadata]
        );

        // 변경 필요 시 메타데이터 업데이트
        if (needsUpdate) {
            await updateMetadata(imageRef, { customMetadata: currentMetadata });
        }
    }
    // 이미지가 아직 존재하지 않는다면 새 이미지를 업로드
    else {
        await uploadString(imageRef, imageAttrs.src, 'data_url');
        await updateMetadata(imageRef, { customMetadata: currentMetadata });
    }

    const imageUrl = await getDownloadURL(imageRef);

    return {
        src: imageUrl,
        id: imageAttrs.id,
        width: imageAttrs.width,
        height: imageAttrs.height,
        alt: imageAttrs.alt,
        title: imageAttrs.title,
        textAlign: imageAttrs.textAlign,
    }
}
