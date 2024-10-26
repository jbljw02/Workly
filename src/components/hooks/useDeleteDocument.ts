import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteDocuments, DocumentProps, setDocuments } from '@/redux/features/documentSlice';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';

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
            dispatch(deleteDocuments(document.id));
            console.log("document.id: ", document.id);
            console.log("tiptapCloudSecret: ", tiptapCloudSecret);
            console.log("wsUrl: ", wsUrl);

            // tiptap cloud의 문서 삭제
            const res = await axios.delete(`${wsUrl}/api/documents/${document.id}`, {
                headers: {
                    Authorization: tiptapCloudSecret,
                },
            });
            console.log("res: ", res);

            // 파이어베이스의 문서 삭제
            await axios.delete('/api/document', {
                params: {
                    email: user.email,
                    folderId: document.folderId,
                    docId: document.id,
                }
            });

            // 현재 페이지를 삭제했다면 홈으로 라우팅
            if (document.id === documentId) {
                router.push('/editor/home');
            }

            dispatch(showCompleteAlert(`${document.title}의 삭제를 완료했습니다.`));
        } catch (error) {
            console.error(error);

            // 삭제에 실패하면 롤백
            dispatch(setDocuments(prevDocs));
            dispatch(showWarningAlert(`${document.title}의 삭제에 실패했습니다.`))
        }
    }

    return deleteDoc;
}