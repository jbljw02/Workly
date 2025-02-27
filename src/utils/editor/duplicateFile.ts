import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { AppDispatch } from "@/redux/store";
import { FileNodeAttrs } from "../../lib/fileNode";

const duplicateFile = async (editor: Editor, fileNode: FileNodeAttrs, dispatch: AppDispatch) => {
    const newId = uuidv4();

    const newFileNode = {
        ...fileNode,
        id: newId,
        className: 'uploading' // 업로드 중임을 표시
    };

    const { state } = editor.view;
    const position = state.selection.anchor;

    // 현재 노드의 위치와 크기를 찾음
    let nodePos = position;
    let nodeSize = 1; // 기본값

    state.doc.descendants((node, pos) => {
        if (node.type.name === 'file' && node.attrs.id === fileNode.id) {
            nodePos = pos; // 찾은 파일의 노드 시작 위치
            nodeSize = node.nodeSize; // 찾은 파일의 전체 노드 크기
            return false;
        }
        return true;
    });

    // 현재 노드의 끝 위치에 새 노드를 삽입
    editor.chain().insertContentAt(nodePos + nodeSize, {
        type: 'file',
        attrs: newFileNode,
    }).focus().run();

    try {
        // URL을 Blob으로 변환
        const response = await fetch(fileNode.href);
        const blob = await response.blob();

        // 새 ID로 스토리지에 업로드
        const storage = getStorage();
        const storageRef = ref(storage, `files/${newId}`);

        await uploadBytes(storageRef, blob);
        const newHref = await getDownloadURL(storageRef);

        // 업로드 완료 후 파일 주소 변경
        editor.view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'file' && node.attrs.id === newId) {
                const { tr } = editor.state;
                editor.view.dispatch(tr.setNodeMarkup(pos, undefined, {
                    ...newFileNode,
                    href: newHref,
                    className: '',
                }));
                return false;
            }
            return true;
        });
    } catch (error) {
        // 업로드 실패 시 파일 삭제
        editor.view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'file' && node.attrs.id === newId) {
                const { tr } = editor.state;
                editor.view.dispatch(tr.delete(pos, pos + node.nodeSize));
                return false;
            }
            return true;
        });
        dispatch(showWarningAlert('파일 복제에 실패했습니다.'));
    }
}

export default duplicateFile;