import React, { useMemo, useRef, useState } from 'react';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import FileInfoIcon from '../../../../../public/svgs/editor/file-info.svg';
import FileFullModal from '@/components/modal/FileFullModal';
import FileBlockIcon from '../../../../../public/svgs/editor/file-block.svg';
import MenuIcon from '../../../../../public/svgs/editor/menu-vertical.svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFileNode } from '@/redux/features/editor/fileSlice';
import FileEditInput from './FileEditInput';
import EditIcon from '../../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import MenuList from '../../../menu/MenuList';
import { MenuItemProps } from '../../../menu/MenuItem';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import { FileNodeAttrs } from '../../../../lib/fileNode';
import useCheckSelected from '@/hooks/editor/useCheckSelected';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import downloadFile from '@/utils/editor/downloadFile';
import copyURL from '@/utils/editor/copyURL';
import useCheckDemo from '@/hooks/demo/useCheckDemo';
import useDuplicateFile from '@/hooks/editor/useDuplicateFile';

export interface FileNodeViewProps {
    editor: Editor;
    node: Node & {
        attrs: FileNodeAttrs;
    };
    isPublished?: boolean;
}

export default function FileNodeView({ editor, node }: FileNodeViewProps) {
    const dispatch = useAppDispatch();

    const checkDemo = useCheckDemo();
    const duplicateFile = useDuplicateFile();

    const { id, href, name, mimeType, size, className } = node.attrs;

    const fileNode = useAppSelector(state => state.fileNode);
    const webPublished = useAppSelector(state => state.webPublished);
    const editorPermission = useAppSelector(state => state.editorPermission);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuListOpen, setMenuListOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 파일명을 수정중인지
    const [isSelected, setIsSelected] = useState(false);

    const fileRef = useRef<HTMLDivElement | null>(null);

    // 파일 사이즈에 따라 형식 조정
    const formatSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const fileClick = () => {
        dispatch(setFileNode({
            id: id,
            href: href,
            name: name,
            mimeType: mimeType,
            size: size,
            className: className,
        }));
        setIsModalOpen(true);
    };

    const fileMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!webPublished) {
            dispatch(setFileNode({
                id: id,
                href: href,
                name: name,
                mimeType: mimeType,
                size: size,
                className: className,
            }));

            setMenuListOpen(!menuListOpen);
        }
    }

    // 파일 드래그 종료
    const dropFile = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        // 마우스 커서의 X,Y 좌표를 가져옴
        const dropPosition = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });

        if (dropPosition) {
            const transaction = editor.state.tr;

            // 현재 위치에서 노드를 삭제하고 드롭된 위치로 삽입
            transaction.deleteRange(editor.state.selection.from, editor.state.selection.to);
            transaction.insert(dropPosition.pos, editor.schema.nodes.file.create(node.attrs));

            editor.view.dispatch(transaction);
        }
    };

    // 파일명 변경
    const editFileName = () => {
        setIsEditing(true);
    }

    // 현재 선택된 파일을 삭제
    const deleteFile = async (editor: Editor, id: string) => {
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

        if (!checkDemo()) {
            const storage = getStorage();
            const fileRef = ref(storage, `documents/${selectedDocument.id}/files/${id}`);
            await deleteObject(fileRef);
        }

        if (isFound) {
            dispatch(tr); // 트랜잭션을 적용
        }
    };

    const menuItems: MenuItemProps[] = useMemo(() => {
        // 모든 권한에 공통적으로 들어가는 아이템
        const commonMenuItems = [
            {
                Icon: LinkCopyIcon,
                IconWidth: "16",
                label: "링크 복사",
                onClick: () => copyURL(fileNode.href, dispatch),
                disabled: checkDemo(),
            },
            {
                Icon: DownloadIcon,
                IconWidth: "14",
                label: "다운로드",
                onClick: () => downloadFile(fileNode.href, fileNode.name, dispatch),
            }
        ];

        // 모든 권한을 가지고 있을 때의 아이템
        const fullPermissionItems = [
            {
                Icon: EditIcon,
                IconWidth: "16",
                label: "파일명 변경",
                onClick: () => editFileName(),
            },
            ...commonMenuItems,
            {
                Icon: CopyIcon,
                IconWidth: "14",
                label: "복제",
                onClick: () => duplicateFile(editor, fileNode),
                horizonLine: true,
            },
            {
                Icon: DeleteIcon,
                IconWidth: "17",
                label: "삭제",
                onClick: () => deleteFile(editor, fileNode.id),
            },
        ]

        if (editorPermission === '읽기 허용') {
            return [
                ...commonMenuItems,
            ]
        }
        else {
            return [
                ...fullPermissionItems,
            ]
        }
    }, [fileNode, editorPermission]);

    useCheckSelected({ editor, node, setIsSelected, className });
    useClickOutside(fileRef, () => setMenuListOpen(false), fileRef);

    return (
        <>
            <NodeViewWrapper
                onDragEnd={dropFile}
                data-drag-handle
                contentEditable={false}
                draggable="true">
                <div
                    data-file={name}
                    onClick={fileClick}
                    ref={fileRef}
                    className={`data-file relative inline-flex flex-row items-center justify-center w-auto rounded-md p-2 mt-2 mb-3 hover:bg-gray-200 duration-200 cursor-pointer 
                        ${menuListOpen ? 'bg-gray-200' : 'bg-gray-100'}
                        ${isSelected ? 'border-2 border-blue-600 ' : 'border-2 border-transparent'}
                        ${className?.includes('uploading') ? 'opacity-60 pointer-events-none cursor-not-allowed' : ''}`}>
                    {
                        className?.includes('uploading') ? (
                            <div className='pt-0.5 pl-1 pr-1'>
                                <LoadingSpinner size={16} color="#212121" />
                            </div>
                        ) : (
                            <FileInfoIcon width="26" />
                        )
                    }
                    <div className='flex justify-between items-center mt-0.5'>
                        {
                            // 파일명을 현재 수정중인지에 따라서 분기
                            isEditing ?
                                <FileEditInput
                                    editor={editor}
                                    node={node}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing} /> :
                                <div className='ml-1'>{name}</div>
                        }
                        <div className='ml-3 mr-4 text-sm text-neutral-500'>{formatSize(size)}</div>
                        {
                            // 게시된 문서를 확인중이라면 리스트 확인 불가
                            !webPublished && (
                                <div
                                    onClick={fileMenuClick}
                                    className={`-mr-0.5 hover:bg-gray-300 p-1 rounded-sm 
                                    ${menuListOpen ? 'bg-gray-200' : ''}`}>
                                    {
                                        <MenuIcon width="18" />
                                    }
                                </div>
                            )
                        }
                    </div>
                    {
                        // 문서가 게시중일 때 리스트 확인 불가
                        !webPublished && (
                            <MenuList
                                isOpen={menuListOpen}
                                menuList={menuItems}
                                setListOpen={setMenuListOpen}
                                listPositon={{ top: '50px', right: '0px' }} />
                        )
                    }
                </div>
            </NodeViewWrapper>
            <FileFullModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                href={fileNode.href}
                download={fileNode.name}>
                {
                    // 파일 형식이 PDF일 경우 PDF 뷰어를 통해 보여주고, 다른 형식일 경우 대체 화면 출력
                    mimeType === 'application/pdf' ? (
                        <iframe
                            className='absolute w-full h-full max-w-[90vw] max-h-[90vh] rounded-md'
                            src={href}
                            title={name} />
                    ) :
                        (
                            <div className="flex flex-col items-center justify-center text-zinc-50">
                                <div className='flex flex-row justify-center items-center mb-4'>
                                    <FileBlockIcon class="mb-1" width="32" />
                                    <div className='text-lg ml-2'>{name}</div>
                                </div>
                                <div>미리보기를 제공하지 않는 파일입니다.</div>
                                <a
                                    className="text-base underline"
                                    href={href}
                                    download={name}>
                                    파일 다운로드
                                </a>
                            </div>
                        )}
            </FileFullModal>
        </>
    );
}
