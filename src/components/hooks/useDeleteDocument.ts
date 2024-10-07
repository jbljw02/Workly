import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteDocuments, DocumentProps, setDocuments } from '@/redux/features/documentSlice';
import { showCompleteAlert, showWarningAlert } from '@/redux/features/alertSlice';

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
            // 현재 페이지가 삭제된 것이 아니라면 alert 발생
            else {
                dispatch(showCompleteAlert(`${document.title} 삭제를 완료했습니다.`));
            }
        } catch (error) {
            console.error(error);

            // 삭제에 실패하면 롤백
            dispatch(setDocuments(prevDocs));
            dispatch(showWarningAlert(`${document.title} 삭제에 실패했습니다.`))
        }
    }

    return deleteDoc;
}

export default useDeleteDocument;