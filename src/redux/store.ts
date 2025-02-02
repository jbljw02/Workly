import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import userReducers from './features/userSlice';
import scaleReducers from './features/scaleSlice';
import editorImageReducers from './features/editorImageSlice';
import fileReducers from './features/fileSlice';
import linkReducers from './features/linkSlice';
import selectionReducers from './features/selectionSlice';
import textColorReducers from './features/textColorSlice';
import documentReducers from './features/documentSlice';
import folderReducers from './features/folderSlice';
import alertReducers from './features/alertSlice';
import shareDocumentReducers from './features/shareDocumentSlice';
import trashReducers from './features/trashSlice';
import webPublishedReducers from './features/webPublishedSlice';
import selectedNodeReducers from './features/selectedNodeSlice';
import placeholderReducers from './features/placeholderSlice';
import connectionReducers from './features/connectionSlice';

const combinedReducer = combineReducers({
    user: userReducers.user,
    allUsers: userReducers.allUsers,
    editorScale: scaleReducers.editorScale,
    imageDimension: editorImageReducers.imageDimension,
    crop: editorImageReducers.crop,
    openFullModal: editorImageReducers.openFullModal,
    fileNode: fileReducers.fileNode,
    linkTooltip: linkReducers.linkTooltip,
    textSelection: selectionReducers.textSelection,
    textColor: textColorReducers.textColor,
    openColorPicker: textColorReducers.openColorPicker,
    documents: documentReducers.documents,
    selectedDocument: documentReducers.selectedDocument,
    folders: folderReducers.folders,
    globalAlert: alertReducers.globalAlert,
    coworkerList: shareDocumentReducers.coworkerList,
    searchedCoworkers: shareDocumentReducers.searchedCoworkers,
    selectedCoworkers: shareDocumentReducers.selectedCoworkers,
    targetSharingEmail: shareDocumentReducers.targetSharingEmail,
    editorPermission: shareDocumentReducers.editorPermission,
    documentsTrash: trashReducers.documentsTrash,
    foldersTrash: trashReducers.foldersTrash,
    isDeletingModalOpen: trashReducers.isDeletingModalOpen,
    webPublished: webPublishedReducers.webPublished,
    selectedNode: selectedNodeReducers.selectedNode,
    workingSpinner: placeholderReducers.workingSpinner,
    loading: placeholderReducers.loading,
    connection: connectionReducers.connection,
    connectedUsers: connectionReducers.connectedUsers,
    docSynced: connectionReducers.docSynced,
    sortRule: documentReducers.sortRule,
    failedAlert: alertReducers.failedAlert,
})

// RootState가 Redux 스토어의 상태 타입임을 나타냄
export type RootState = ReturnType<typeof combinedReducer>;

const masterReducer = (state: RootState, action: AnyAction) => {
    // 액션의 타입이 HYDRATE일 경우, 즉 서버 사이드 렌더링이 발생할 때
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // 현재 클라이언트의 상태를 그대로 가져옴
            ...action.payload, // 모든 state를 SSR에서 가져와서 클라이언트에 병합(SSR에서 설정해주지 않은 값은 초기값으로 세팅됨)
        };
        return nextState;
    }
    // 클라이언트에서 발생한 액션은, 각각의 리듀서에 의해 처리
    else {
        return combinedReducer(state, action);
    }
}

export const makeStore = () => {
    return configureStore({
        reducer: masterReducer,
    });
};

// AppStore 타입은 configureStore로 생성된 타입
export type AppStore = ReturnType<typeof makeStore>
// AppDispatch는 스토어의 dispatch 타입
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
