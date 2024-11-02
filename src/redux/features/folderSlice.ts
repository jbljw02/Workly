import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collaborator, DocumentProps } from "./documentSlice";
import { UserProps } from "./userSlice";

export type Folder = {
    id: string;
    name: string;
    documentIds: string[];
    author: UserProps;
    collaborators?: Collaborator[];
    createdAt: string;
    readedAt: string;
}

const foldersState: Folder[] = [];

export const foldersSlice = createSlice({
    name: 'folders',
    initialState: foldersState,
    reducers: {
        addFolders: (state, action) => {
            state.push(action.payload);
        },
        renameFolders: (state, action) => {
            const { folderId, newName } = action.payload;
            const index = state.findIndex(folder => folder.id === folderId);
            if (index !== -1) {
                state[index].name = newName;
            }
        },
        deleteFolders: (state, action) => {
            return state.filter(folder => folder.id !== action.payload);
        },
        setFolders: (state, action) => {
            return action.payload;
        },
        // 폴더에 문서를 추가
        addDocumentToFolder: (state, action) => {
            const { folderId, docId } = action.payload;
            const folder = state.find(folder => folder.id === folderId);
            if (folder) {
                folder.documentIds.push(docId);
            }
        },
        removeDocumentFromFolder: (state, action) => {
            const { folderId, docId } = action.payload;
            const folder = state.find(folder => folder.id === folderId);
            if (folder) {
                folder.documentIds = folder.documentIds.filter(id => id !== docId); // 문서 ID 제거
            }
        },
    },
})

export const { addFolders, renameFolders, deleteFolders, setFolders, addDocumentToFolder, removeDocumentFromFolder } = foldersSlice.actions;

const reducers = {
    folders: foldersSlice.reducer,
}

export default reducers;