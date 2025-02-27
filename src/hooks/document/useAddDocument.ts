import { addDocuments } from "@/redux/features/document/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { addDocumentToFolder } from "@/redux/features/folder/folderSlice";
import { showWarningAlert } from "@/redux/features/common/alertSlice";
import { SetInvalidInfo } from "@/types/invalidInfoProps.type";
import { useRouter } from "next-nprogress-bar";
import { Folder } from "@/types/folder.type";
import { DocumentProps } from "@/types/document.type";
import useCheckDemo from "../demo/useCheckDemo";

export default function useAddDocument() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const checkDemo = useCheckDemo();

    const user = useAppSelector(state => state.user);

    // 선택된 폴더에 문서 추가
    // setInvalidInfo가 있다면, 즉 모달을 통해 추가했다면 라우팅 없이 추가만 진행
    const addDocToFolder = async (docTitle: string, folder: Folder, setInvalidInfo?: SetInvalidInfo) => {
        const autoCreate = setInvalidInfo ? false : true;

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
            if (!checkDemo()) {
                // 파이어베이스에 문서 추가
                await axios.post('/api/document',
                    {
                        folderId: folder.id,
                        document: newDocument,
                        // 즉시 페이지로 라우팅하지 않는 경우 클라우드에 문서 추가 요청 전송
                        autoCreate: autoCreate,
                    });
            }

            // 전체 문서 배열에 추가
            dispatch(addDocuments(newDocument));
            // 문서 ID를 기본 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: folder.id, docId: newDocument.id }));

            // 모달을 통해 추가했다면 라우팅 없이 추가만 진행
            autoCreate ?
                router.push(`/${checkDemo() ? 'demo' : 'editor'}/${folder.id}/${newDocument.id}`) :
                setInvalidInfo && setInvalidInfo(({
                    msg: '',
                    isInvalid: false,
                }));

            return false;
        } catch (error) {
            autoCreate ?
                dispatch(showWarningAlert('문서 추가에 실패했습니다.')) :
                setInvalidInfo && setInvalidInfo(({
                    msg: '문서 추가에 실패했습니다.',
                    isInvalid: true,
                }));

            return true;
        }
    }

    return addDocToFolder;
}