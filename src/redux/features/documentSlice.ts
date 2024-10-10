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
    createdAt: string;
    updatedAt: string;
    author: string;
    collaborators: Collaborator[];
    folderName: string;
}

const DocumentsState: DocumentProps[] = [];
const selectedDocumentState: DocumentProps = {
    id: '',
    title: '',
    docContent: null,
    createdAt: '',
    updatedAt: '',
    author: '',
    collaborators: [],
    folderName: '',
}

export const documentSlice = createSlice({
    name: 'documents',
    initialState: DocumentsState,
    reducers: {
        addDocuments: (state, action: PayloadAction<DocumentProps>) => {
            state.push(action.payload);
        },
        updateDocuments: (state, action) => {
            // 변경할 문서의 ID를 찾고, 값을 업데이트
            const { docId, ...updatedData } = action.payload;
            const index = state.findIndex(doc => doc.id === docId);
            if (index !== -1) {
                state[index] = { ...state[index], ...updatedData };
            }
        },
        renameDocuments: (state, action) => {
            const { docId, newTitle } = action.payload;
            const index = state.findIndex(folder => folder.id === docId);
            if (index !== -1) {
                state[index].title = newTitle;
            }
        },
        deleteDocuments: (state, action) => {
            return state.filter(doc => doc.id !== action.payload);
        },
        setDocuments: (state, action) => {
            return action.payload;
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

export const { addDocuments, updateDocuments, renameDocuments, deleteDocuments, setDocuments } = documentSlice.actions;
export const { setSelectedDocument } = selectedDocument.actions;

const reducers = {
    documents: documentSlice.reducer,
    selectedDocument: selectedDocument.reducer,
}

export default reducers;