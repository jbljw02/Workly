import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentProps } from "./documentSlice";
import { User } from "./userSlice";

export type Folder = {
    id: string;
    name: string;
    documents: DocumentProps[];
    author: User;
    sharedWith?: string[];
}

const foldersState: Folder[] = [];

export const foldersSlice = createSlice({
    name: 'folders',
    initialState: foldersState,
    reducers: {
        addFolders: (state, action: PayloadAction<Folder>) => {
            state.push(action.payload);
        },
        renameFolders: (state, action) => {
            const index = state.findIndex(folder => folder.id === action.payload.id);
            if (index !== -1) {
                state[index].name = action.payload.newName;
            }
        },
        deleteFolders: (state, action) => {
            return state.filter(folder => folder.id !== action.payload.id);
        },
    },
})

export const { addFolders } = foldersSlice.actions;
export const { renameFolders } = foldersSlice.actions;
export const { deleteFolders } = foldersSlice.actions;

const reducers = {
    folders: foldersSlice.reducer,
}

export default reducers;