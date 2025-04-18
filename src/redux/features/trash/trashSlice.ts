import { Folder } from "@/types/folder.type";
import { createSlice } from "@reduxjs/toolkit";
import { DocumentProps } from "../../../types/document.type";

type TrashSearchCategory = '문서' | '폴더';

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

export const isDeletingModalOpenSlice = createSlice({
    name: 'isDeletingModalOpen',
    initialState: false,
    reducers: {
        setIsDeletingModalOpen: (state, action) => {
            return action.payload;
        }
    }
})

// 휴지통 검색 카테고리
export const trashSearchCategorySlice = createSlice({
    name: 'trashSearchCategory',
    initialState: '문서' as TrashSearchCategory,
    reducers: {
        setTrashSearchCategory: (state, action) => {
            return action.payload;
        }
    }
})

// 휴지통 선택된 아이템
export const selectedTrashItemSlice = createSlice({
    name: 'selectedTrashItem',
    initialState: null as DocumentProps | Folder | null,
    reducers: {
        setSelectedTrashItem: (state, action) => {
            return action.payload;
        }
    }
})

export const { addDocumentsToTrash, deleteDocumentsFromTrash, setDocumentsTrash, deleteAllDocumentsTrashOfFolder } = documentsTrashSlice.actions;
export const { addFoldersToTrash, deleteFoldersFromTrash, setFoldersTrash, addDocumentToFolderTrash, removeDocumentFromFolderTrash } = foldersTrashSlice.actions;
export const { setIsDeletingModalOpen } = isDeletingModalOpenSlice.actions;
export const { setTrashSearchCategory } = trashSearchCategorySlice.actions;
export const { setSelectedTrashItem } = selectedTrashItemSlice.actions;

const reducers = {
    documentsTrash: documentsTrashSlice.reducer,
    foldersTrash: foldersTrashSlice.reducer,
    isDeletingModalOpen: isDeletingModalOpenSlice.reducer,
    trashSearchCategory: trashSearchCategorySlice.reducer,
    selectedTrashItem: selectedTrashItemSlice.reducer,
}

export default reducers;