import { useClickOutside } from "@/components/hooks/useClickOutside";
import { setFileNode } from "@/redux/features/fileSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { FileNodeViewProps } from "./FileNodeView";

interface FileEditInput extends FileNodeViewProps {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileEditInput({ editor, node, setIsEditing }: FileEditInput) {
    const dispatch = useAppDispatch();

    const { title } = node.attrs;

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const fileNode = useAppSelector(state => state.fileNode);

    const [fileTitle, setFileTitle] = useState(''); // 파일명
    const [fileMimeType, setFileMimeType] = useState(''); // 확장자

    // input 바깥을 클릭할 시 창 닫음
    useClickOutside(containerRef, () => setIsEditing(false));

    useEffect(() => {
        // input에 포커스를 둠
        if (inputRef.current) {
            inputRef.current.focus();
        }

        // 파일명과 확장자 분리
        const dotIndex = title.lastIndexOf('.'); // 마지막 .의 인덱스를 찾음
        if (dotIndex !== -1) {
            // '파일명.pdf'가 파일명이라면
            setFileTitle(title.substring(0, dotIndex)); // '파일명'
            setFileMimeType(title.substring(dotIndex)); // .pdf
        } else {
            setFileTitle(title);
            setFileMimeType(''); // 확장자가 없는 경우
        }
    }, [title]);

    // span을 이용해 요소의 크기를 구하여 input의 width 요소에 맞춤
    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    }, [fileTitle]);

    const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileTitle(e.target.value);
    }

    // 파일명 변경을 마침
    const completeEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 엔터키를 누를 시에 작업을 마침
        if (e.key === 'Enter') {
            const updatedTitle = fileTitle + fileMimeType; // 파일명과 확장자를 합함

            dispatch(setFileNode({
                ...fileNode,
                title: updatedTitle,
            }));

            const { tr } = editor.state;
            const { doc } = editor.state;

            let pos: number | null = null; // 노드의 위치

            // file 노드 위치를 찾기
            doc.descendants((node, position) => {
                if (node.type.name === 'file' && node.attrs.id === fileNode.id) {
                    pos = position;
                    return false;
                }
                return true;
            });

            // 위치가 확인되면 노드를 업데이트
            if (pos) {
                editor.view.dispatch(
                    tr.setNodeMarkup(pos, undefined, {
                        ...fileNode,
                        title: updatedTitle,
                    })
                );
            }
            setIsEditing(false);
        }
    }

    return (
        <div
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            className='ml-1 cursor-auto'>
            <input
                ref={inputRef}
                type="text"
                value={fileTitle}
                onChange={fileTitleChange}
                onKeyDown={completeEdit}
                className="bg-transparent border-none outline-none box-border" />
            <span
                ref={spanRef}
                className="invisible absolute whitespace-nowrap">
                {fileTitle}
            </span>
            {
                fileMimeType &&
                <span>{fileMimeType}</span>
            }
        </div>
    )
}
