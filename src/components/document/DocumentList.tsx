'use client';

import formatTimeDiff from "@/utils/formatTimeDiff";
import IconButton from "../button/IconButton";
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import ShareDocumentIcon from '../../../public/svgs/share-document.svg'
import { useRouter } from "next/navigation";
import { DocumentProps } from "@/redux/features/documentSlice";
import EmptyFolderIcon from '../../../public/svgs/empty-folder.svg';

type DocumentListProps = {
    documents: DocumentProps[];
    isShared?: boolean;
}

export default function DocumentList({ documents, isShared }: DocumentListProps) {
    const router = useRouter();
    return (
        <div className='flex flex-col w-full h-full'>
            {
                documents.length > 0 ? (
                    documents.map(document => (
                        <div
                            key={document.id}
                            className='flex items-center w-full hover:bg-gray-100 cursor-pointer transition-all duration-150 group'
                            onClick={() => router.push(`/editor/${document.folderId}/${document.id}`)}>
                            <div className='flex flex-1 items-center py-5 mx-12 border-b'>
                                {/* 문서 아이콘 */}
                                <div className='p-1 rounded-lg border-gray-200 border mr-4'>
                                    <ShareDocumentIcon
                                        className="text-gray-400"
                                        width="36" />
                                </div>
                                {/* 문서 정보 */}
                                <div className='flex-1 flex flex-col'>
                                    <div className='text-[15px] ml-0.5 font-semibold truncate'>
                                        {document.title || '제목 없는 문서'}
                                    </div>
                                    <div className='flex flex-row items-center gap-2 text-xs mt-1 text-neutral-500'>
                                        <span className='bg-gray-100 group-hover:bg-gray-200 rounded px-1.5 py-0.5 truncate transition-colors duration-150'>
                                            {isShared ?
                                                `${document.author.displayName}에 의해 공유됨` :
                                                document.folderName}
                                        </span>
                                        <span>{formatTimeDiff(document.updatedAt)}</span>
                                    </div>
                                </div>
                                <div className='justify-end items-center'>
                                    <IconButton
                                        icon={<MenuIcon width="17" />}
                                        onClick={() => console.log('메뉴 버튼')}
                                        hover="hover:bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    ))
                ) :
                    (
                        <div className="flex items-center justify-center w-full h-full text-neutral-500 gap-4 mb-14">
                            <EmptyFolderIcon width="48" />
                            <div className="text-lg">아직 문서가 존재하지 않습니다.</div>
                        </div>
                    )
            }
        </div>
    )
}