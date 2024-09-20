import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { useEffect, useState } from 'react';

const CustomNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, extension, getPos } = props;
    const [isHovered, setIsHovered] = useState(false);

    console.log("ASXFADS");


    const handleMouseEnter = () => {
        setIsHovered(true); // 노드에 마우스가 올라갔을 때 상태를 업데이트
        console.log("마우스가 올라간 노드:", node);
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // 마우스가 벗어나면 상태를 업데이트
    };

    return (
        <NodeViewWrapper
            as="div"
            className="custom-node"
            // className={`custom-node ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div>ABCD</div>
            <NodeViewContent className="node-content" />
        </NodeViewWrapper>
    );
};

export default CustomNodeView;