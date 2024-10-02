import getUserDocument from "@/components/hooks/getUserDocument";
import { setSelectedDocument } from "@/redux/features/documentSlice";
import { Folder } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import PaperIcon from '../../../../../public/svgs/editor/paper.svg'

export default function HeaderTitle() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    // 현재 선택된 문서를 지정
    useEffect(() => {
        if (user.email) {
            const currentDocument = documents.find(doc => doc.id === documentId);
            dispatch(setSelectedDocument(currentDocument));
        }
    }, [user]);

    // 폴더 목록과 라우팅 된 폴더의 ID를 기반으로 현재 폴더를 구함
    const folders = useAppSelector(state => state.folders);
    const currentFolder = folders.find((folder: Folder) => folder.id === folderId);

    return (
        <div className='flex flex-row items-center gap-2'>
            <div className='flex items-center p-1 mr-0.5 border rounded-md'>
                <PaperIcon width="20" />
            </div>
            <div className='flex flex-row items-center gap-1'>
                <div className='text-sm rounded-sm hover:underline cursor-pointer'>{currentFolder?.name}</div>
                <div className='text-sm font-light mx-1'>{'/'}</div>
                <div className='text-sm font-bold'>{selectedDocument.title || '제목 없는 문서'}</div>
            </div>
        </div>
    )
}