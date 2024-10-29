import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteDocuments, DocumentProps, setDocuments } from '@/redux/features/documentSlice';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';
import { addDocumentsToTrash, deleteDocumentsFromTrash, setDocumentsTrash } from '@/redux/features/trashSlice';

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

export default function useDeleteDocument() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(state => state.user);
    const documents = useAppSelector(state => state.documents);

    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const folderId = pathParts[2];
    const documentId = pathParts[3];

    // 문서 삭제 요청
    const deleteDoc = async (e: React.MouseEvent, document: DocumentProps) => {
        e.stopPropagation();

        const prevDocs = [...documents];

        try {
            // 문서를 삭제하고 휴지통에 추가
            dispatch(deleteDocuments(document.id));
            dispatch(addDocumentsToTrash(document));

            // 현재 페이지를 삭제했다면 홈으로 라우팅
            if (document.id === documentId) {
                router.push('/editor/home');
            }

            // tiptap cloud 서버에서 문서 삭제
            await axios.delete('/api/tiptap-document', {
                params: {
                    docName: document.id,
                }
            });

            // 파이어베이스의 문서 삭제
            await axios.delete('/api/document', {
                params: {
                    email: user.email,
                    folderId: document.folderId,
                    docId: document.id,
                }
            });

            dispatch(showCompleteAlert(`${document.title || '제목 없는 문서'}의 삭제를 완료했습니다.`));
        } catch (error) {
            // 삭제에 실패하면 롤백
            dispatch(setDocuments(prevDocs));
            dispatch(setDocumentsTrash(prevDocs));
            
            dispatch(showWarningAlert(`${document.title || '제목 없는 문서'}의 삭제에 실패했습니다.`))
        }
    }

    return deleteDoc;
}