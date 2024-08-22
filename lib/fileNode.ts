import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FileNodeView from '@/components/editor/child/file/FileNodeView';

const FileNode = Node.create({
    name: 'file', // 노드의 이름
    group: 'inline', // inline 속성을 가짐 - 다른 요소와 같은 줄에 위치
    inline: true,

    addAttributes() {
        return {
            // 파일의 고유 아이디
            id: {
                default: null,
            },
            // 파일의 경로
            href: {
                default: null,
            },
            // 파일명
            title: {
                default: null,
            },
            // 파일의 형식
            mimeType: {
                default: null,
            },
            // 파일의 크기
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