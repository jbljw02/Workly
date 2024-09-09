import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { DragHandle } from '@tiptap-pro/extension-drag-handle-react';
import MenuIcon from '../../../../public/svgs/editor/menu-vertical.svg'; // 드래그 핸들 아이콘

const CustomNodeView = (props: NodeViewProps) => {
    const { editor } = props;
    console.log("에디터: ", props);
    console.log("AA");

    return (
        <NodeViewWrapper
            draggable={true}
            data-drag-handle
            as="div"
            className="custom-node relative p-2 border rounded-md">
            {/* 드래그 핸들 */}
            <DragHandle editor={editor} className="drag-handle absolute left-[-30px] top-1/2 transform -translate-y-1/2">
                <MenuIcon width="20" />
            </DragHandle>

            {/* 노드의 컨텐츠 */}
            <NodeViewContent className="node-content" />
        </NodeViewWrapper>
    );
};

export default CustomNodeView;