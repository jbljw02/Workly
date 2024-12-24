import { showWarningAlert } from "@/redux/features/alertSlice";
import { Editor } from "@tiptap/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SetResizableImageProps } from "../../../lib/ImageNode";
import { AppDispatch } from "@/redux/store";
import { v4 as uuidv4 } from 'uuid';
import getDimensions from "./getDimensions";

const uploadNewImage = async (editor: Editor, file: File, src: string, docId: string, dispatch: AppDispatch) => {
    const dimensions = await getDimensions(src);
    const imageId = uuidv4();

    // 로딩 상태의 이미지 삽입
    const imageAttrs = {
        id: imageId,
        src: '/pngs/image-placeholder.png',
        title: file.name,
        width: dimensions.width,
        height: dimensions.height,
        className: 'resizable-img uploading',
        'data-keep-ratio': true,
        textAlign: 'left',
    };

    
    try {
        (editor.commands.setResizableImage as SetResizableImageProps)(imageAttrs);

        // 스토리지에 이미지 업로드
        const storage = getStorage();
        const imageRef = ref(storage, `documents/${docId}/images/${imageId}`);

        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);

        // 이미지 로드 확인
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

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

export default uploadNewImage;