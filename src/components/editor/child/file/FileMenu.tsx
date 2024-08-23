import { useClickOutside } from "@/components/hooks/useClickOutside";
import { useRef, useState } from "react"
import EditIcon from '../../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import { Editor } from "@tiptap/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileNode, setFileNode } from "@/redux/features/fileSlice";
import { v4 as uuidv4 } from 'uuid';
import FileEditInput from "./FileEditInput";

type MenuItemProps = {
    Icon: React.ElementType;
    IconWidth: string;
    label: string;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    href?: string;
    download?: string;
}

const MenuItem = ({ Icon,
    IconWidth,
    label,
    setMenuOpen,
    onClick,
    href,
    download }: MenuItemProps) => {
    const itemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
        setMenuOpen(false);
    };
    return (
        <div
            className="flex flex-row items-center w-full py-1 pl-3 pr-10 hover:bg-gray-100 cursor-pointer"
            onClick={itemClick}>
            <Icon width={IconWidth} />
            <div className="ml-2">{label}</div>
        </div>
    );
}

type FileMenuProps = {
    editor: Editor;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileMenu({ editor, setMenuOpen, setIsEditing }: FileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const fileNode = useAppSelector(state => state.fileNode);

    useClickOutside(menuRef, () => setMenuOpen(false));

    // 파일명 변경
    const editFileName = () => {
        setIsEditing(true);
    }

    // 파일 링크를 클립보드에 복사
    const copyLink = (href: string) => {
        navigator.clipboard.writeText(href);
    };

    // 파일 다운로드
    const downloadFile = (href: string, download: string) => {
        if (href && download) {
            const link = document.createElement('a');
            link.href = href;
            link.download = download;
            link.click();
        }
    }

    // 파일을 복제
    const duplicateFile = (editor: Editor, fileNode: FileNode) => {
        const { state, dispatch } = editor.view;
        const { tr } = state;
        const position = state.selection.anchor; // 현재 커서 위치

        // 복제할 파일의 새로운 고유 ID 생성
        const newFileNode = {
            ...fileNode,
            id: uuidv4(), // 새로운 고유 ID 생성
        };

        // 복제할 파일 노드 삽입
        tr.insert(position, state.schema.nodes.file.create(newFileNode));
        dispatch(tr); // 트랜잭션을 적용
    };

    // 현재 선택된 파일을 삭제
    const deleteFile = (editor: Editor | null, id: string) => {
        if (editor) {
            // editor.view === EditorView 객체
            // state: 현재 에디터의 상태
            // dispatch: 트랜잭션을 적용해 에디터의 상태를 업데이트
            const { state, dispatch } = editor.view;
            const tr = state.tr; // 트랜잭션을 현재 상태에서 생성
            let isFound = false; // 해당 노드를 찾았는지 여부

            // 문서의 모든 노드를 순회(node: 각 노드, pos: 각 노드의 위치)
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'file' && node.attrs.id === id) {
                    // 일치하는 노드를 찾으면 트랜잭션에 해당 노드를 삭제하도록 함
                    tr.delete(pos, pos + node.nodeSize);
                    isFound = true;
                    return false; // 노드를 찾으면 탐색 중지
                }
                return true; // 현재 노드가 삭제할 대상이 아닌 경우 계속 탐색
            });

            if (isFound) {
                dispatch(tr); // 트랜잭션을 적용
            }
        }
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-12 right-[-105px] bg-white rounded-md py-1.5 z-10 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]">
            <ul className="list-none text-sm m-0 p-0">
                <MenuItem
                    Icon={EditIcon}
                    IconWidth="16"
                    setMenuOpen={setMenuOpen}
                    onClick={editFileName}
                    label="파일명 변경" />
                <MenuItem
                    Icon={LinkCopyIcon}
                    IconWidth="16"
                    setMenuOpen={setMenuOpen}
                    onClick={() => copyLink(fileNode.href)}
                    label="링크 복사" />
                <MenuItem
                    Icon={DownloadIcon}
                    IconWidth="16"
                    setMenuOpen={setMenuOpen}
                    label="다운로드"
                    onClick={() => downloadFile(fileNode.href, fileNode.title)}
                    href={fileNode.href}
                    download={fileNode.title} />
                <div className="w-full border-t border-gray-200 my-1.5"></div>
                <MenuItem
                    Icon={CopyIcon}
                    IconWidth="14"
                    setMenuOpen={setMenuOpen}
                    label="복제"
                    onClick={() => duplicateFile(editor, fileNode)} />
                <MenuItem
                    Icon={DeleteIcon}
                    IconWidth="17"
                    setMenuOpen={setMenuOpen}
                    onClick={() => deleteFile(editor, fileNode.id)}
                    label="삭제" />
            </ul>
        </div>
    )

}