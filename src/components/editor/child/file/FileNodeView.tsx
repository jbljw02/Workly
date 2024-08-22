import React, { useEffect, useState } from 'react';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import FileInfoIcon from '../../../../../public/svgs/editor/file-info.svg';
import FileFullModal from '@/components/modal/FileFullModal';
import FileBlockIcon from '../../../../../public/svgs/editor/file-block.svg';
import MenuIcon from '../../../../../public/svgs/editor/menu.svg';
import FileMenu from './FileMenu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { FileNode, setFileNode } from '@/redux/features/fileSlice';

interface FileNodeProps {
    attrs: FileNode;
}

type FileNodeViewProps = {
    editor: Editor;
    node: FileNodeProps;
}

export default function FileNodeView({ editor, node }: FileNodeViewProps) {
    const dispatch = useAppDispatch();

    const { id, href, title, mimeType, size } = node.attrs;

    const fileNode = useAppSelector(state => state.fileNode);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
            title: title,
            mimeType: mimeType,
            size: size,
        }));
        setIsModalOpen(true);
    };

    const fileMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        dispatch(setFileNode({
            id: id,
            href: href,
            title: title,
            mimeType: mimeType,
            size: size,
        }));
        setMenuOpen(true);
    }

    return (
        <>
            <NodeViewWrapper>
                <div
                    onClick={fileClick}
                    className={`relative inline-flex flex-row items-center justify-center w-auto rounded-md p-2 mt-2 mb-2 hover:bg-gray-100 cursor-pointer duration-100 ${menuOpen ? 'bg-gray-100' : 'bg-gray-50'}`}>
                    <FileInfoIcon width="26" />
                    <div className='flex justify-between items-center mt-0.5'>
                        <div className='ml-1'>{title}</div>
                        <div className='ml-3 text-sm text-neutral-500'>{formatSize(size)}</div>
                        <div
                            onClick={fileMenuClick}
                            className={`ml-4 -mr-0.5 hover:bg-gray-200 p-1 rounded-sm ${menuOpen ? 'bg-gray-200' : ''}`}>
                            <MenuIcon width="18" />
                        </div>
                    </div>
                    {
                        menuOpen && (
                            <FileMenu
                                editor={editor}
                                setMenuOpen={setMenuOpen} />
                        )
                    }
                </div>
            </NodeViewWrapper>
            <FileFullModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                href={fileNode.href}
                download={fileNode.title}>
                {
                    // 파일 형식이 PDF일 경우 PDF 뷰어를 통해 보여주고, 다른 형식일 경우 대체 화면 출력
                    mimeType === 'application/pdf' ? (
                        <iframe
                            className='absolute w-full h-full max-w-[90vw] max-h-[90vh] rounded-md'
                            src={href}
                            title={title} />
                    ) :
                        (
                            <div className="flex flex-col items-center justify-center text-zinc-50">
                                <div className='flex flex-row justify-center items-center mb-4'>
                                    <FileBlockIcon class="mb-1" width="32" />
                                    <div className='text-lg ml-2'>{title}</div>
                                </div>
                                <div>미리보기를 제공하지 않는 파일입니다.</div>
                                <a
                                    className="text-base underline"
                                    href={href}
                                    download={title}>
                                    파일 다운로드
                                </a>
                            </div>
                        )}
            </FileFullModal>
        </>
    );
}