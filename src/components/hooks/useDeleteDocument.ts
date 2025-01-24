import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteDocuments, DocumentProps } from '@/redux/features/documentSlice';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';
import { addDocumentsToTrash, addDocumentToFolderTrash } from '@/redux/features/trashSlice';
import { removeDocumentFromFolder } from '@/redux/features/folderSlice';
import useUndoState from './useUndoState';
import { useRouter } from 'next-nprogress-bar';
import { setDeleting } from '@/redux/features/placeholderSlice';

export default function useDeleteDocument() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const undoState = useUndoState();

    const user = useAppSelector(state => state.user);

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2];
    const documentId = pathParts[3];

    // 문서 삭제 요청
    const deleteDoc = async (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();

        try {
            dispatch(setDeleting(true)); // 삭제 중 상태로 변경

            // 문서를 폴더에서 삭제하고, 전체 문서 목록에서 삭제
            dispatch(removeDocumentFromFolder({
                folderId: document.folderId,
                docId: document.id,
            }));
            dispatch(deleteDocuments(document.id));

            // 삭제한 문서를 휴지통에 추가
            dispatch(addDocumentsToTrash(document));
            dispatch(addDocumentToFolderTrash({
                folderId: document.folderId,
                docId: document.id,
            }));

            if (pathParts.length === 4) {
                // 현재 페이지를 삭제했다면 홈으로 라우팅
                if ((document.id).trim() === documentId.trim()) {
                    router.push('/editor/home');
                }
            }

            console.log('docContent', document.docContent);

            // 파이어베이스의 문서 삭제
            await axios.delete('/api/document', {
                data: {
                    email: user.email,
                    folderId: document.folderId,
                    docId: document.id,
                    docContent: document.docContent,
                }
            });

            dispatch(setDeleting(false));
            // 문서의 상세 페이지일 경우
            dispatch(showCompleteAlert(`${document.title || '제목 없는 문서'}의 삭제를 완료했습니다.`));
        } catch (error) {
            // 삭제에 실패하면 롤백
            undoState();
            dispatch(showWarningAlert(`${document.title || '제목 없는 문서'}의 삭제에 실패했습니다.`))
        }
    }

    return deleteDoc;
}