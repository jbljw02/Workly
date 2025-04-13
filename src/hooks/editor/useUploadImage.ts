import { SetResizableImageProps } from "@/lib/ImageNode";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getDimensions from "@/utils/editor/getDimensions";
import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';
import useCheckDemo from "../demo/useCheckDemo";
import uploadToStorage from "@/utils/editor/uploadToStorage";
import uploadDemoImage from "@/utils/editor/uploadDemoFile";

export default function useUploadImage(documentId: string) {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

    const uploadNewImage = async (editor: Editor, file: File, src: string) => {
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
            let url = '';
            if (checkDemo()) {
                url = await uploadDemoImage(file);
            } else {
                url = await uploadToStorage(file, `documents/${documentId}/images/${imageId}`);
            }

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

    return uploadNewImage;
}