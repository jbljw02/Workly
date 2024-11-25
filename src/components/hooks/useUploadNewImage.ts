import getDimensions from "@/utils/image/getDimensions";
import { Editor } from "@tiptap/react";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { SetResizableImageProps } from "../../../lib/ImageNode";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from "@/redux/hooks";
import { showWarningAlert } from "@/redux/features/alertSlice";

export default function useUploadImage() {
    const dispatch = useAppDispatch();

    const uploadNewImage = async (editor: Editor, title: string, src: string) => {
        const dimensions = await getDimensions(src);
        const imageId = uuidv4();

        // 로딩 상태의 이미지 삽입
        const imageAttrs = {
            id: imageId,
            src: src,  // 원본 이미지를 흐리게 표시
            title: title,
            width: dimensions.width,
            height: dimensions.height,
            className: 'resizable-img uploading', // 업로드 중임을 표시
            'data-keep-ratio': true,
            textAlign: 'left',
            alt: '',
        };

        // 흐린 이미지 먼저 삽입
        (editor.commands.setResizableImage as SetResizableImageProps)(imageAttrs);

        try {
            // 스토리지에 이미지 업로드
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
                        className: 'resizable-img' // 업로드 중을 의미하는 클래스 제거
                    }));
                    return false;
                }
                return true;
            });
        } catch (error) {
            // 업로드 실패 시 이미지 삭제
            editor.view.state.doc.descendants((node, pos) => {
                if (node.type.name === 'imageComponent' && node.attrs.id === imageId) {
                    const { tr } = editor.state;
                    editor.view.dispatch(tr.delete(pos, pos + node.nodeSize));
                    return false;
                }
                return true;
            });
            dispatch(showWarningAlert('이미지 업로드에 실패했습니다.'));
        }
    };
    return uploadNewImage;
}