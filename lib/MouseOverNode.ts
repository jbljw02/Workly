import MouseOverNodeView from '@/components/editor/child/MouseOverNodeView';
import { Node, mergeAttributes } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';
import { ReactNodeViewRenderer } from '@tiptap/react';

// 모든 블록 요소에 공통적으로 적용될 커스텀 노드
const MouseOverNode = Node.create({
    name: 'custom-node',

    group: 'block', // 모든 블록 요소에 적용
    content: 'block*', // 자식 블록을 포함할 수 있음

    addNodeView() {
        return ReactNodeViewRenderer(MouseOverNodeView); // 커스텀 NodeView 등록
    },
});

export default MouseOverNode;