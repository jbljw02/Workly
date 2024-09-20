import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type FileNode = {
    id: string,
    href: string,
    title: string,
    mimeType: string,
    size: number,
}

const FileNodeState = {
    id: '',
    href: '',
    title: '',
    mimeType: '',
    size: 0,
}

export const fileNodeSlice = createSlice({
    name: 'fileNode',
    initialState: FileNodeState,
    reducers: {
        setFileNode: (state, action: PayloadAction<FileNode>) => {
            return action.payload;
        },
    },
})

export const { setFileNode } = fileNodeSlice.actions;

const reducers = {
    fileNode: fileNodeSlice.reducer,
}

export default reducers;