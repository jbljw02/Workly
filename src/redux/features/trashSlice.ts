import { createSlice } from "@reduxjs/toolkit";
import { DocumentProps } from "./documentSlice";
import { Folder } from "./folderSlice";

const DocumentsState: DocumentProps[] = [];
const FoldersState: Folder[] = [];

export const documentsTrashSlice = createSlice({
    name: 'documentsTrash',
    initialState: DocumentsState,
    reducers: {
        addDocumentsToTrash: (state, action) => {
            state.push(action.payload);
        },
        deleteDocumentsFromTrash: (state, action) => {
            return state.filter(doc => doc.id !== action.payload);
        },
        setDocumentsTrash: (state, action) => {
            return action.payload;
        },
    }
})

export const foldersTrashSlice = createSlice({
    name: 'foldersTrash',
    initialState: FoldersState,
    reducers: {
         addFoldersToTrash: (state, action) => {
            state.push(action.payload);
        },
        deleteFoldersFromTrash: (state, action) => {
            return state.filter(folder => folder.id !== action.payload);
        },
        setFoldersTrash: (state, action) => {
            return action.payload;
        },
        removeDocumentFromFolderTrash: (state, action) => {
            const { folderId, docId } = action.payload;
            const folder = state.find(folder => folder.id === folderId);
            if (folder) {
                folder.documentIds = folder.documentIds.filter(id => id !== docId);
            }
        },
    }
})

export const { addDocumentsToTrash, deleteDocumentsFromTrash, setDocumentsTrash } = documentsTrashSlice.actions;
export const { addFoldersToTrash, deleteFoldersFromTrash, setFoldersTrash } = foldersTrashSlice.actions;

const reducers = {
    documentsTrash: documentsTrashSlice.reducer,
    foldersTrash: foldersTrashSlice.reducer,
}

export default reducers;