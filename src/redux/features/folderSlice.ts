import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentProps } from "./documentSlice";
import { UserProps } from "./userSlice";

export type Folder = {
    id: string;
    name: string;
    documentIds: string[];
    author: UserProps;
    sharedWith?: string[];
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
                folder.documentIds.push(docId); // 폴더에 문서 ID를 추가
            }
        },
    },
})

export const { addFolders, renameFolders, deleteFolders, setFolders, addDocumentToFolder } = foldersSlice.actions;

const reducers = {
    folders: foldersSlice.reducer,
}

export default reducers;