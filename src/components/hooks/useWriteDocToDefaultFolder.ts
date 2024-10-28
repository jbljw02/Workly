import { showWarningAlert } from "@/redux/features/alertSlice";
import { addDocuments, DocumentProps } from "@/redux/features/documentSlice";
import { addDocumentToFolder, Folder } from "@/redux/features/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function useWriteDocToDefaultFolder() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const folders = useAppSelector(state => state.folders);
    const user = useAppSelector(state => state.user);

    const writeDocumentToDefaultFolder = async () => {
        const defaultFolder: Folder = folders[0];

        const newDocument: DocumentProps = {
            id: uuidv4(),
            title: '',
            docContent: null,
            createdAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            updatedAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            author: user,
            folderId: defaultFolder.id,
            folderName: defaultFolder.name,
            collaborators: [],
        };

        try {
            // tiptap cloud 서버에 문서 생성
            await axios.post('/api/tiptap-document',
                {
                    docName: newDocument.id,
                });

            // 파이어베이스에 문서 추가
            await axios.post('/api/document',
                {
                    folderId: defaultFolder.id,
                    document: newDocument
                });

            // 전체 문서 배열에 추가
            dispatch(addDocuments(newDocument));
            // 문서 ID를 기본 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: defaultFolder.id, docId: newDocument.id }));

            router.push(`/editor/${defaultFolder.id}/${newDocument.id}`);
        } catch (error) {
            console.error(error);
            dispatch(showWarningAlert('문서 작성에 실패했습니다. 잠시 후 다시 시도해주세요.'));
        }
    }

    return writeDocumentToDefaultFolder;
}