import { createSlice } from "@reduxjs/toolkit";

type LoadingProps = {
    isDocumentLoading: boolean;
    isFolderLoading: boolean;
    isSidebarLoading: boolean;
    isDocumentPreviewLoading: boolean;
    isTrashLoading: boolean;
    isImageCropping: boolean;
    isMenuListLoading: boolean;
}

// 화면이 마운트 될 때 즉시 스켈레톤 UI를 출력하기 위해 초기값을 true로 설정
// finally문에서 false로 처리해주므로 상관 X
const loadingState: LoadingProps = {
    isDocumentLoading: true,
    isFolderLoading: true,
    isSidebarLoading: true,
    isDocumentPreviewLoading: true,
    isTrashLoading: true,
    isImageCropping: false, // 이미지 자르기는 화면 초기 렌더링 시 보여지는 요소가 아니므로 false
    isMenuListLoading: false,
}

export const workingSpinnerSlice = createSlice({
    name: 'workingSpinner',
    initialState: false,
    reducers: {
        setWorkingSpinner: (state, action) => {
            return action.payload;
        }
    }
})

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: loadingState,
    reducers: {
        setDocumentLoading: (state, action) => {
            state.isDocumentLoading = action.payload;
        },
        setFolderLoading: (state, action) => {
            state.isFolderLoading = action.payload;
        },
        setSidebarLoading: (state, action) => {
            state.isSidebarLoading = action.payload;
        },
        setDocumentPreviewLoading: (state, action) => {
            state.isDocumentPreviewLoading = action.payload;
        },
        setTrashLoading: (state, action) => {
            state.isTrashLoading = action.payload;
        },
        setImageCropping: (state, action) => {
            state.isImageCropping = action.payload;
        },
    }
});

export const { setWorkingSpinner } = workingSpinnerSlice.actions;
export const { setDocumentLoading, setFolderLoading, setSidebarLoading, setDocumentPreviewLoading, setTrashLoading, setImageCropping } = loadingSlice.actions;

const reducers = {
    workingSpinner: workingSpinnerSlice.reducer,
    loading: loadingSlice.reducer
}

export default reducers;