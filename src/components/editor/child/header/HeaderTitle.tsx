import { useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import PaperIcon from '../../../../../public/svgs/editor/paper.svg'

export default function HeaderTitle() {
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2]; // '/editor/[folderId]/[documentId]'일 때 folderId는 2번째 인덱스
    const documentId = pathParts[3]; // documentId는 3번째 인덱스

    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const webPublished = useAppSelector(state => state.webPublished);

    return (
        <div className='flex flex-row items-center gap-2'>
            <div className='flex items-center p-1 mr-0.5 border rounded-md'>
                <PaperIcon width="20" />
            </div>
            <div className='flex flex-row items-center gap-1'>
                {
                    !webPublished && (
                        <>
                            <div className='text-sm rounded-sm'>{selectedDocument.folderName || '알 수 없는 폴더'}</div>
                            <div className='text-sm font-light mx-1'>{'/'}</div>
                        </>
                    )
                }
                <div className='text-sm font-bold'>{selectedDocument.title || '제목 없는 문서'}</div>
            </div>
        </div>
    )
}