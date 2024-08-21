import React, { useEffect, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import FileInfoIcon from '../../../../../public/svgs/editor/file-info.svg';
import FileFullModal from '@/components/modal/FileFullModal';
import FileBlockIcon from '../../../../../public/svgs/editor/file-block.svg';
import MenuIcon from '../../../../../public/svgs/editor/menu.svg';

export default function FileNodeView({ node }) {
    const { href, title, mimeType, size } = node.attrs;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatSize = (size) => {
        console.log("아: ", size);
        if (size < 1024) return `${size} B`;
        else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const fileClick = (e) => {
        e.preventDefault();
        setIsModalOpen(true);  // 모든 파일에 대해 모달을 띄우도록 설정
    };

    return (
        <>
            <NodeViewWrapper className="file-component">
                <a
                    className='inline-flex flex-row items-center justify-center rounded-md w-auto mt-2 mb-2 p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer duration-100'
                    onClick={fileClick}
                    rel="noopener noreferrer">
                    <FileInfoIcon width="26" />
                    <div className='flex justify-between items-center mt-0.5'>
                        <div className='ml-1'>{title}</div>
                        <div className='ml-3 text-sm text-neutral-500'>{formatSize(size)}</div>
                        <div className='ml-4 -mr-0.5 hover:bg-gray-200 p-1 rounded-sm'>
                            <MenuIcon width="18" />
                        </div>
                    </div>
                </a>
            </NodeViewWrapper>
            <FileFullModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}>
                {
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