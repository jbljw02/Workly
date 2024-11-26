import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FileNodeAttrs } from "../../../lib/fileNode";

export type FileNode = {
    id: string,
    href: string,
    name: string,
    mimeType: string,
    size: number,
}

const FileNodeState: FileNodeAttrs = {
    id: '',
    href: '',
    name: '',
    mimeType: '',
    size: 0,
    className: '',
}

export const fileNodeSlice = createSlice({
    name: 'fileNode',
    initialState: FileNodeState,
    reducers: {
        setFileNode: (state, action: PayloadAction<FileNodeAttrs>) => {
            return action.payload;
        },
    },
})

export const { setFileNode } = fileNodeSlice.actions;

const reducers = {
    fileNode: fileNodeSlice.reducer,
}

export default reducers;