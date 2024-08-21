import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FileNodeView from '@/components/editor/child/file/FileNodeView';

const FileNode = Node.create({
    name: 'file', // 노드의 이름
    group: 'inline', // inline 속성을 가짐 - 다른 요소와 같은 줄에 위치
    inline: true,

    addAttributes() {
        return {
            href: {
                default: null,
            },
            title: {
                default: null,
            },
            mimeType: {
                default: null,
            },
            size: {
                default: null,
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(FileNodeView);
    },
});

export default FileNode;