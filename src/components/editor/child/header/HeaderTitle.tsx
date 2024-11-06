import { setSelectedDocument } from "@/redux/features/documentSlice";
import { Folder } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import PaperIcon from '../../../../../public/svgs/editor/paper.svg'

export default function HeaderTitle({ isPublished }: { isPublished: boolean }) {
    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const folders = useAppSelector(state => state.folders);
    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    // 현재 선택된 문서를 지정
    // documents의 값이 변경될 때마다 현재 선택된 문서의 값도 업데이트
    useEffect(() => {
        const currentDocument = documents.find(doc => doc.id === documentId);
        if (currentDocument) {
            dispatch(setSelectedDocument(currentDocument));
        }
    }, [folders, documents]);

    return (
        <div className='flex flex-row items-center gap-2'>
            <div className='flex items-center p-1 mr-0.5 border rounded-md'>
                <PaperIcon width="20" />
            </div>
            <div className='flex flex-row items-center gap-1'>
                {
                    !isPublished && (
                        <>
                            <div className='text-sm rounded-sm hover:underline cursor-pointer'>{selectedDocument.folderName}</div>
                            <div className='text-sm font-light mx-1'>{'/'}</div>
                        </>
                    )
                }
                <div className='text-sm font-bold'>{selectedDocument.title || '제목 없는 문서'}</div>
            </div>
        </div>
    )
}