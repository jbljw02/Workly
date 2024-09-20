import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/react";
import { User } from "./userSlice";

export type DocumentProps = {
    id: string;
    title: string;
    docContent: JSONContent | null;
    createdAt: string;
    updatedAt: string;
    author: User;
    collaborators?: string[];
}

const DocumentsState: DocumentProps[] = [];

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
    },
})

export const { addDocuments } = documentSlice.actions;
export const { updateDocuments } = documentSlice.actions;
export const { deleteDocuments } = documentSlice.actions;

const reducers = {
    documents: documentSlice.reducer,
}

export default reducers;