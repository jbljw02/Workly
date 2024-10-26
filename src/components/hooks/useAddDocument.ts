import { addDocuments, DocumentProps } from "@/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { addDocumentToFolder, Folder } from "@/redux/features/folderSlice";
import { showCompleteAlert } from "@/redux/features/alertSlice";
import { SetInvalidInfo } from "@/types/invalidInfoProps";

export default function useAddDocument() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    // 선택된 폴더에 문서 추가
    const addDocToFolder = async (docTitle: string, folder: Folder, setInvalidInfo: SetInvalidInfo) => {
        const newDocument: DocumentProps = {
            id: uuidv4(),
            title: docTitle,
            createdAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            updatedAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            author: user,
            folderId: folder.id,
            folderName: folder.name,
            collaborators: [],
        }

        try {
            await axios.post('/api/document',
                {
                    folderId: folder.id,
                    document: newDocument
                });

            // 전체 문서 배열에 추가
            dispatch(addDocuments(newDocument));
            // 문서 ID를 기본 폴더에 추가
            dispatch(addDocumentToFolder({ folderId: folder.id, docId: newDocument.id }));

            setInvalidInfo(({
                msg: '',
                isInvalid: false,
            }));

            dispatch(showCompleteAlert(`${folder.name}에 문서가 추가되었습니다.`));
            return false;
        } catch (error) {
            console.error(error);
            setInvalidInfo(({
                msg: '문서 추가에 실패했습니다. 잠시 후 다시 시도해주세요.',
                isInvalid: true,
            }));

            return true;
        }
    }

    return addDocToFolder;
}