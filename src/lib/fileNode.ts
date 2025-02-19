import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin } from 'prosemirror-state';
import FileNodeView from '@/components/editor/child/file/FileNodeView';

export interface FileNodeAttrs {
    id: string;
    href: string;
    name: string;
    mimeType: string;
    size: number;
    className: string;
}

const FileNode = Node.create({
    name: 'file',
    group: 'block',
    inline: false,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null }, // 파일의 고유 ID
            href: { default: null }, // 파일 경로
            name: { default: null }, // 파일명
            mimeType: { default: null }, // 파일 형식
            size: { default: null }, // 파일 크기
            className: { default: null }
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-file]',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', { ...HTMLAttributes, 'data-file': HTMLAttributes.title }];
    },
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        dragstart(view, event) {
                            const { state } = view;
                            const { selection } = state;

                            // 선택된 노드의 위치에서 노드를 가져옴
                            const node = state.doc.nodeAt(selection.from);

                            // 파일 노드에 대해서만 이벤트 처리
                            if (node && node.type.name === 'file') {
                                event.dataTransfer?.setData(
                                    "application/x-prosemirror-node",
                                    JSON.stringify(node.attrs)
                                );
                                return true;
                            }

                            return false;
                        },
                    },
                },
            }),
        ];
    },
    addNodeView() {
        return ReactNodeViewRenderer(FileNodeView as any);
    },

});

export default FileNode;