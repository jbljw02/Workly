import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import { UserProps } from "./userSlice";

export type DocumentProps = {
    id: string;
    title: string;
    docContent: JSONContent | null;
    createdAt: string;
    updatedAt: string;
    author: UserProps;
    collaborators?: string[];
    folderName: string;
}

const DocumentsState: DocumentProps[] = [];
const selectedDocumentState: DocumentProps = {
    id: '',
    title: '',
    docContent: null,
    createdAt: '',
    updatedAt: '',
    author: {
        email: '',
        displayName: '',
        photoURL: '',
    },
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
            const index = state.findIndex(doc => doc.id === action.payload.id);
            if (index !== -1) {
                // 문서가 존재할 때만 업데이트
                state[index] = { ...state[index], ...action.payload };
            }
        },
        deleteDocuments: (state, action) => {
            return state.filter(doc => doc.id !== action.payload.id);
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

export const { addDocuments, updateDocuments, deleteDocuments, setDocuments } = documentSlice.actions;
export const { setSelectedDocument } = selectedDocument.actions;

const reducers = {
    documents: documentSlice.reducer,
    selectedDocument: selectedDocument.reducer,
}

export default reducers;