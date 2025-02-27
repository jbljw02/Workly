import { FileNodeAttrs } from "@/lib/fileNode";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';
import useCheckDemo from "../demo/useCheckDemo";
import uploadDemoFile from "@/utils/editor/uploadDemoFile";
import uploadToStorage from "@/utils/editor/uploadToStorage";

export default function useUploadFile() {
    const dispatch = useAppDispatch();
    const checkDemo = useCheckDemo();

    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const uploadNewFile = async (editor: Editor, file: File, pos: number) => {
        const fileAttrs: FileNodeAttrs = {
            id: uuidv4(),
            href: '',
            name: file.name,
            mimeType: file.type,
            size: file.size,
            className: 'uploading'
        }
    
        try {
            editor.chain().insertContentAt(pos, {
                type: 'file',
                attrs: fileAttrs,
            }).focus().run();
    
            let url = '';
            if(checkDemo()) {
                url = await uploadDemoFile(file);
            } else {
                url = await uploadToStorage(file, `documents/${selectedDocument.id}/files/${fileAttrs.id}`);
            }
    
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
