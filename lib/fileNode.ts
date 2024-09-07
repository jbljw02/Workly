import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin } from 'prosemirror-state';
import FileNodeView from '@/components/editor/child/file/FileNodeView';

const FileNode = Node.create({
    name: 'file', // 노드의 이름
    group: 'block',
    inline: false,
    draggable: true, // 드래그 가능하게 설정

    addAttributes() {
        return {
            id: { default: null }, // 파일의 고유 ID
            href: { default: null }, // 파일 경로
            title: { default: null }, // 파일명
            mimeType: { default: null }, // 파일 형식
            size: { default: null }, // 파일 크기
        };
    },

    // ProseMirror 플러그인은 에디터의 동작을 확장하거나 변경하는 데에 사용됨
    // 이미지가 복사되는 현상 원인
    // addProseMirrorPlugins() {
    //     return [
    //         new Plugin({
    //             props: {
    //                 handleDOMEvents: {
    //                     dragstart(view, event) {
    //                         const { state } = view;
    //                         const { selection } = state;

    //                         // 드래그 이벤트가 발생할 때 선택된 노드의 속성을 가져옴
    //                         const node = state.doc.nodeAt(selection.from);
    //                         if (node) {
    //                             // 노드의 속성을 dataTransfer에 저장
    //                             event.dataTransfer?.setData(
    //                                 "application/x-prosemirror-node",
    //                                 JSON.stringify(node.attrs)
    //                             );
    //                         }
    //                         return true;
    //                     },
    //                 },
    //             },
    //         }),
    //     ];
    // },

    addNodeView() {
        return ReactNodeViewRenderer(FileNodeView);
    },
});

export default FileNode;