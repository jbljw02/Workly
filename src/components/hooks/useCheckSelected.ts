import { useEffect } from "react";
import { NodeSelection } from "prosemirror-state";
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Editor } from "@tiptap/react";

type UseCheckSelectedProps = {
    editor: Editor;
    node: any;
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useCheckSelected({ editor, node, setIsSelected }: UseCheckSelectedProps) {
    // 파일 노드가 선택됐음을 표시
    useEffect(() => {
        const { state } = editor.view;
        const { selection } = state;

        const selectedNode = state.doc.nodeAt(selection.from);
        console.log('selectedNode: ', selectedNode);

        // 선택된 노드가 현재 노드인지 확인
        if (selection instanceof NodeSelection) {
            const selectedNode = state.doc.nodeAt(selection.from);

            // 선택된 노드가 'file' 타입이고 현재 노드인지 확인
            if (selectedNode && selectedNode.type.name === node.type.name && selectedNode.attrs.id === node.attrs.id) {
                setIsSelected(true);
            } else {
                setIsSelected(false);
            }
        } else {
            setIsSelected(false);
        }
    }, [editor.view.state.selection, node.attrs.id]);
}