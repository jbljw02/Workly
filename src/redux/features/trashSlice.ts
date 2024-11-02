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
            // 단일 문서일 경우
            if (!Array.isArray(action.payload)) {
                state.push(action.payload);
            }
            // 배열일 경우
            else {
                state.push(...action.payload);
            }
        },
        deleteDocumentsFromTrash: (state, action) => {
            return state.filter(doc => doc.id !== action.payload);
        },
        setDocumentsTrash: (state, action) => {
            return action.payload;
        },
        // 해당 폴더의 모든 문서를 삭제
        deleteAllDocumentsTrashOfFolder: (state, action) => {
            return state.filter(doc => doc.folderId !== action.payload);
        }
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
        addDocumentToFolderTrash: (state, action) => {
            const { folderId, docId } = action.payload;
            const folder = state.find(folder => folder.id === folderId);
            if (folder) {
                folder.documentIds.push(docId);
            }
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

export const { addDocumentsToTrash, deleteDocumentsFromTrash, setDocumentsTrash, deleteAllDocumentsTrashOfFolder } = documentsTrashSlice.actions;
export const { addFoldersToTrash, deleteFoldersFromTrash, setFoldersTrash, addDocumentToFolderTrash, removeDocumentFromFolderTrash } = foldersTrashSlice.actions;

const reducers = {
    documentsTrash: documentsTrashSlice.reducer,
    foldersTrash: foldersTrashSlice.reducer,
}

export default reducers;