import { addDocuments, DocumentProps } from "@/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { addDocumentToFolder, Folder } from "@/redux/features/folderSlice";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { SetInvalidInfo } from "@/types/invalidInfoProps";
import { useRouter } from "next-nprogress-bar";

export default function useAddDocument() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector(state => state.user);

    // 선택된 폴더에 문서 추가
    // setInvalidInfo가 있다면, 즉 모달을 통해 추가했다면 라우팅 없이 추가만 진행
    const addDocToFolder = async (docTitle: string, folder: Folder, setInvalidInfo?: SetInvalidInfo) => {
        const newDocument: DocumentProps = {
            id: uuidv4(),
            title: docTitle,
            docContent: null,
            createdAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            readedAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            author: user,
            folderId: folder.id,
            folderName: folder.name,
            collaborators: [],
            shortcutsUsers: [],
        }

        try {
            // 모달을 통해 추가할 때만 tiptap cloud 서버에 미리 요청
            // 라우팅을 통해 추가할 때는 문서를 생성하면 자동으로 생성됨
            if (setInvalidInfo) {
                // tiptap cloud 서버에 문서 생성
                await axios.post('/api/tiptap-document',
                    {
                        docName: newDocument.id,
                    });
            }

            // 파이어베이스에 문서 추가
            await axios.post('/api/document',
                {
                    folderId: folder.id,
                    document: newDocument
                });

            // 전체 문서 배열에 추가
            dispatch(addDocuments(newDocument));
            // 문서 ID를 기본 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: folder.id, docId: newDocument.id }));

            // 모달을 통해 추가했다면 라우팅 없이 추가만 진행
            setInvalidInfo ?
                setInvalidInfo(({
                    msg: '',
                    isInvalid: false,
                })) :
                router.push(`/editor/${folder.id}/${newDocument.id}`);

            return false;
        } catch (error) {
            setInvalidInfo ?
                setInvalidInfo(({
                    msg: '문서 추가에 실패했습니다.',
                    isInvalid: true,
                })) :
                dispatch(showWarningAlert('문서 추가에 실패했습니다.'));

            return true;
        }
    }

    return addDocToFolder;
}