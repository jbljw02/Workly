import { showWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Editor } from "@tiptap/react";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default function useUploadNewFile() {
    const dispatch = useAppDispatch();

    const uploadNewFile = async (editor: Editor, file: File, src: string, pos: number) => {
        const fileAttrs = {
            id: uuidv4(),
            href: src,
            title: file.name,
            mimeType: file.type,
            size: file.size,
            className: 'uploading'
        }

        editor.chain().insertContentAt(pos, {
            type: 'file',
            attrs: fileAttrs,
        }).focus().run();

        try {
            const storage = getStorage();
            const fileRef = ref(storage, `files/${fileAttrs.id}`);
            await uploadString(fileRef, src, 'data_url');
            const url = await getDownloadURL(fileRef);

            // 업로드 완료 후 파일 주소 변경
            editor.view.state.doc.descendants((node, pos) => {
                if (node.type.name === 'file' && node.attrs.id === fileAttrs.id) {
                    const { tr } = editor.state;
                    editor.view.dispatch(tr.setNodeMarkup(pos, undefined, {
                        ...fileAttrs,
                        href: url,
                        className: '',
                    }));
                    return false;
                }
                return true;
            })
        } catch (error) {
            // 업로드 실패 시 파일 삭제
            editor.view.state.doc.descendants((node, pos) => {
                if (node.type.name === 'file' && node.attrs.id === fileAttrs.id) {
                    const { tr } = editor.state;
                    editor.view.dispatch(tr.delete(pos, pos + node.nodeSize));
                    return false;
                }
                return true;
            });
            dispatch(showWarningAlert('파일 업로드에 실패했습니다.'));
        } 
    }

    return uploadNewFile;
}