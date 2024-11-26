import { showWarningAlert } from "@/redux/features/alertSlice";
import { Editor } from "@tiptap/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from "@/redux/store";
import { FileNodeAttrs } from "../../../lib/fileNode";

const uploadNewFile = async (editor: Editor, file: File, src: string, pos: number, dispatch: AppDispatch) => {
    const fileAttrs: FileNodeAttrs = {
        id: uuidv4(),
        href: src,
        name: file.name,
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

        // URL을 Blob으로 변환
        const response = await fetch(src);
        const blob = await response.blob();

        await uploadBytes(fileRef, blob);
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

export default uploadNewFile;