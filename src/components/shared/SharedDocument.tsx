'use client';

import { useAppSelector } from '@/redux/hooks';
import DocumentIcon from '../../../public/svgs/document.svg';
import { RootState } from '@/redux/store';
import FolderIcon from '../../../public/svgs/folder.svg';
import ShareDocumentIcon from '../../../public/svgs/share-document.svg';
import UserProfile from '../aside/child/user/UserProfile';
import SortIcon from '../../../public/svgs/sort.svg';
import ArrowIcon from '../../../public/svgs/right-arrow.svg';
import CommonButton from '../button/CommonButton';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import Image from 'next/image';
import IconButton from '../button/IconButton';

export default function SharedDocument() {
    const router = useRouter();

    const documents = useAppSelector((state: RootState) => state.documents);

    // 공유중인 문서 목록
    const sharedDocuments = useMemo(() => {
        return documents.filter(document => document.collaborators.length > 0);
    }, [documents]);

    return (
        <div className="flex flex-col w-full gap-5">
            <div className="flex flex-row justify-between items-start pt-10 px-12 pb-6 gap-2">
                <header className="flex flex-col items-start gap-2">
                    <div className="text-3xl font-semibold">공유중인 컨텐츠</div>
                    <div className="pl-0.5 text-sm text-neutral-500">다른 사용자와 함께 작업하고 있는 문서 및 폴더의 목록입니다.</div>
                </header>
                <div className='flex flex-row pt-5 gap-3.5'>
                    <CommonButton
                        style={{
                            px: 'px-4',
                            py: 'py-2',
                            textSize: 'text-sm',
                            textColor: 'text-black',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-100'
                        }}
                        label="새 문서"
                        onClick={() => console.log('문의 남기기')} />
                    <CommonButton
                        style={{
                            px: 'px-4',
                            py: 'py-2',
                            textSize: 'text-sm',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                            hover: 'hover:bg-zinc-800'
                        }}
                        label="새 폴더"
                        onClick={() => router.push('/editor')} />
                </div>
            </div>
            <div className="min-w-full">
                {/* 목록의 헤더 */}
                <div className="flex flex-row w-full px-12">
                    <div className="flex-1 border-b text-left">
                        <div className='inline-block px-1 pb-2 border-b-2 border-black font-semibold relative'>
                            제목
                            <div className="absolute bottom-0 left-0 w-full h-0.1 bg-black" />
                        </div>
                    </div>
                    <div className="border-b text-left">
                        <div className="flex justify-end">
                            <IconButton
                                icon={<SortIcon width="23" />}
                                hover="hover:bg-gray-100"
                                onClick={() => console.log('정렬 버튼')}/>
                        </div>
                    </div>
                </div>
                {/* 공유중인 문서 목록 나열 */}
                <div className='flex flex-col w-full'>
                    {
                        sharedDocuments.map(document => (
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
                                                {document.author.displayName}에 의해 공유됨
                                            </span>
                                            <span>22시간 전 편집</span>
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
                    }
                </div>
            </div>
        </div >
    )
}
