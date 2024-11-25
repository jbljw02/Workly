import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { SetResizableImageProps } from "../../../lib/ImageNode";
import getDimensions from "./getDimensions";
import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';
import { setImageCropping, setImageUploading } from "@/redux/features/placeholderSlice";

const uploadNewImage = async (editor: Editor, title: string, src: string) => {
    const dimensions = await getDimensions(src);
    const imageId = uuidv4();

    // 로딩 상태로 먼저 이미지 삽입
    const imageAttrs = {
        id: imageId,
        src: src,  // 원본 이미지를 흐리게 표시
        title: title,
        width: dimensions.width,
        height: dimensions.height,
        className: 'resizable-img uploading', // 업로드 중 클래스 추가
        'data-keep-ratio': true,
        textAlign: 'left',
        alt: '',
    };

    // 에디터에 흐린 이미지 먼저 삽입
    (editor.commands.setResizableImage as SetResizableImageProps)(imageAttrs);
    dispatch(setImageUploading(true));

    try {
        // Firebase Storage에 업로드
        const storage = getStorage();
        const imageRef = ref(storage, `images/${imageId}`);
        await uploadString(imageRef, src, 'data_url');
        const url = await getDownloadURL(imageRef);

        // 업로드 완료 후 실제 이미지로 교체
        editor.view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'imageComponent' && node.attrs.id === imageId) {
                const { tr } = editor.state;
                editor.view.dispatch(tr.setNodeMarkup(pos, undefined, {
                    ...imageAttrs,
                    src: url,
                    className: 'resizable-img' // 업로드 중 클래스 제거
                }));
                return false;
            }
            return true;
        });
    } finally {
        store.dispatch(setImageCropping(false)); // 로딩 상태 종료
    }
};

export default uploadNewImage;