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
            const index = state.findIndex(doc => doc.id === action.payload);
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload };
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