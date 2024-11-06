import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import { UserProps } from "./userSlice";

export interface Collaborator extends UserProps {
    authority: '읽기 허용' | '쓰기 허용' | '전체 허용' | '관리자';
}

export type DocumentProps = {
    id: string;
    title: string;
    docContent: JSONContent | null;
    createdAt: { seconds: number, nanoseconds: number };
    readedAt: { seconds: number, nanoseconds: number };
    author: UserProps;
    folderId: string;
    folderName: string;
    collaborators: Collaborator[];
    shortcutsUsers: string[];
    isPublished?: boolean;
}

const DocumentsState: DocumentProps[] = [];
const selectedDocumentState: DocumentProps = {
    id: '',
    title: '',
    docContent: null,
    createdAt: { seconds: 0, nanoseconds: 0 },
    readedAt: { seconds: 0, nanoseconds: 0 },
    author: {
        email: '',
        displayName: '',
        photoURL: '',
    },
    folderId: '',
    folderName: '',
    collaborators: [],
    shortcutsUsers: [],
}

export const documentSlice = createSlice({
    name: 'documents',
    initialState: DocumentsState,
    reducers: {
        addDocuments: (state, action) => {
            // 단일 문서일 경우
            if (!Array.isArray(action.payload)) {
                state.push(action.payload);
            }
            // 배열일 경우
            else {
                state.push(...action.payload);
            }
        },
        updateDocuments: (state, action) => {
            // 변경할 문서의 ID를 찾고, 값을 업데이트
            const { docId, ...updatedData } = action.payload;
            const index = state.findIndex(doc => doc.id === docId);
            if (index !== -1) {
                state[index] = { ...state[index], ...updatedData };
            }
        },
        deleteDocuments: (state, action) => {
            return state.filter(doc => doc.id !== action.payload);
        },
        // 해당 폴더의 모든 문서를 삭제/복원
        deleteAllDocumentsOfFolder: (state, action) => {
            return state.filter(doc => doc.folderId !== action.payload);
        },
        renameDocuments: (state, action) => {
            const { docId, newTitle } = action.payload;
            const index = state.findIndex(folder => folder.id === docId);
            if (index !== -1) {
                state[index].title = newTitle;
            }
        },
        setDocuments: (state, action) => {
            return action.payload;
        },
        // 협업자의 권한을 변경
        updateCollaboratorAuthority: (state, action) => {
            const { docId, email, newAuthority } = action.payload;
            const document = state.find(doc => doc.id === docId);
            if (document) {
                const collaborator = document.collaborators.find(collab => collab.email === email);
                if (collaborator) {
                    collaborator.authority = newAuthority;
                }
            }
        },
        // 협업자를 추가
        addCollaborator: (state, action) => {
            const { docId, collaborators } = action.payload;
            const document = state.find(doc => doc.id === docId);
            if (document) {
                document.collaborators.push(...collaborators);
            }
        },
        // 협업자를 삭제
        deleteCollaborator: (state, action) => {
            const { docId, email } = action.payload;
            const document = state.find(doc => doc.id === docId);
            if (document) {
                document.collaborators = document.collaborators.filter(collab => collab.email !== email);
            }
        },
        // 즐겨찾기 여부 토글
        toggleShortcut: (state, action) => {
            const { docId, email } = action.payload;
            const document = state.find(doc => doc.id === docId);
            if (document) {
                // 이미 즐겨찾기에 존재하면 제거, 없으면 추가
                document.shortcutsUsers = document.shortcutsUsers.includes(email) ?
                    document.shortcutsUsers.filter(user => user !== email) :
                    [...document.shortcutsUsers, email];
            }
        },
        // 문서를 게시
        publishContent: (state, action) => {
            const { docId } = action.payload;
            const document = state.find(doc => doc.id === docId);
            if (document) {
                document.isPublished = true;
            }
        }
    },
})

export const selectedDocument = createSlice({
    name: 'selectedDocument',
    initialState: selectedDocumentState,
    reducers: {
        setSelectedDocument: (state, action) => {
            return action.payload;
        }
    }
})

export const { addDocuments, updateDocuments, renameDocuments, deleteAllDocumentsOfFolder, updateCollaboratorAuthority, addCollaborator, deleteCollaborator, setDocuments, deleteDocuments, toggleShortcut, publishContent } = documentSlice.actions;
export const { setSelectedDocument } = selectedDocument.actions;

const reducers = {
    documents: documentSlice.reducer,
    selectedDocument: selectedDocument.reducer,
}

export default reducers;