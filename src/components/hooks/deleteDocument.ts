import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteDocuments, DocumentProps, setDocuments } from '@/redux/features/documentSlice';

const useDeleteDocument = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(state => state.user);
    const documents = useAppSelector(state => state.documents);

    // 문서 삭제 요청
    const deleteDoc = async (document: DocumentProps, documentId: string) => {
        const prevDocs = [...documents];

        try {
            dispatch(deleteDocuments(document.id));

            await axios.delete('/api/document', {
                params: {
                    email: user.email,
                    parentFolderName: document.folderName,
                    docId: document.id,
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            // 현재 페이지를 삭제했다면 라우팅
            if (document.id === documentId) {
                router.push('/editor/home');
            }
        } catch (error) {
            console.error(error);

            // 삭제에 실패하면 롤백
            dispatch(setDocuments(prevDocs));
        }
    }

    return deleteDoc;
}

export default useDeleteDocument;