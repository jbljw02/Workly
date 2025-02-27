import { addDocuments } from "@/redux/features/document/documentSlice";
import { addFolders, addDocumentToFolder } from "@/redux/features/folder/folderSlice";
import { setDemoUser } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Folder } from "@/types/folder.type";
import downloadAvatar from "@/utils/downloadAvatar";
import { DocumentProps } from "@/types/document.type";
import { v4 as uuidv4 } from 'uuid';
import { UserProps } from "@/types/user.type";
import { setDocumentLoading, setDocumentPreviewLoading, setFolderLoading, setSidebarLoading, setTrashLoading } from "@/redux/features/common/placeholderSlice";

export default function useSetInitialDemoUser() {
    const dispatch = useAppDispatch();

    const setInitialDemoUser = async (userResponse: UserProps) => {
        const avatarURL = await downloadAvatar();

        dispatch(setDemoUser({
            uid: userResponse.uid,
            photoURL: avatarURL,
        }));

        // 초기 폴더 생성
        const initialFolder: Folder = {
            id: uuidv4(),
            name: '내 폴더',
            documentIds: [],
            author: {
                email: userResponse.email,
                displayName: userResponse.displayName,
                photoURL: avatarURL,
                uid: userResponse.uid,
            },
        }

        // 초기 문서 생성
        const initialDocument: DocumentProps = {
            id: uuidv4(),
            title: 'Workly에 오신 것을 환영합니다!',
            docContent: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'left' },
                        content: [{
                            type: 'text',
                            text: '환영합니다. Workly는 실시간 문서 작성, 협업 서비스입니다.'
                        }]
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'left' },
                        content: [{
                            type: 'text',
                            text: '튜토리얼은 필요 없습니다.'
                        }]
                    },
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'left' },
                        content: [{
                            type: 'text',
                            text: '문서를 작성하고, 다른 사용자에게 공유하면 끝입니다.'
                        }]
                    }
                ]
            },
            createdAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            readedAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: Math.floor((Date.now() % 1000) * 1000000),
            },
            author: {
                email: userResponse.email,
                displayName: userResponse.displayName,
                photoURL: avatarURL,
                uid: userResponse.uid,
            },
            folderId: initialFolder.id,
            folderName: initialFolder.name,
            collaborators: [],
            shortcutsUsers: [],
        }

        dispatch(addDocuments(initialDocument));
        dispatch(addFolders(initialFolder));
        dispatch(addDocumentToFolder({
            folderId: initialFolder.id,
            docId: initialDocument.id,
        }));

        dispatch(setDocumentLoading(false));
        dispatch(setFolderLoading(false));
        dispatch(setSidebarLoading(false));
        dispatch(setDocumentPreviewLoading(false));
        dispatch(setTrashLoading(false));
    }

    return setInitialDemoUser;
}