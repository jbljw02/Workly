import { createSlice } from "@reduxjs/toolkit";
import { Collaborator } from "./documentSlice";

export const targetSharingEmail = createSlice({
    name: 'targetSharingEmail',
    initialState: '',
    reducers: {
        setTargetSharingEmail: (state, action) => {
            return action.payload;
        }
    },
})

export const searchedCoworkers = createSlice({
    name: 'searchedCoworkers',
    initialState: [] as Collaborator[],
    reducers: {
        setSearchedCoworkers: (state, action) => {
            return action.payload;
        },
        updateSearchedCoworkerAuthority: (state, action) => {
            const { email, newAuthority } = action.payload;
            const coworker = state.find(coworker => coworker.email === email);
            if (coworker) {
                coworker.authority = newAuthority;
            }
        },
    },
})

export const coworkerList = createSlice({
    name: 'coworkerList',
    initialState: [] as Collaborator[],
    reducers: {
        setCoworkerList: (state, action) => {
            return action.payload;
        },
        addCoworker: (state, action) => {
            state.push(action.payload);
        },
        updateCoworkerAuthority: (state, action) => {
            const { email, newAuthority } = action.payload;
            const coworkerIndex = state.findIndex(coworker => coworker.email === email);

            if (coworkerIndex !== -1) {
                state[coworkerIndex] = {
                    ...state[coworkerIndex],
                    authority: newAuthority,
                };
            }
        },
        deleteCoworker: (state, action) => {
            return state.filter(coworker => coworker.email !== action.payload);
        }
    },
})

export const selectedCoworkers = createSlice({
    name: 'selectedCoworkers',
    initialState: [] as Collaborator[],
    reducers: {
        setSelectedCoworkers: (state, action) => {
            return action.payload;
        },
        updateAuthority: (state, action) => {
            const { email, newAuthority } = action.payload;
            const coworker = state.find(coworker => coworker.email === email);
            if (coworker) {
                coworker.authority = newAuthority;
            }
        },
    },
})

export const editorPermission = createSlice({
    name: 'editorPermission',
    initialState: null,
    reducers: {
        setEditorPermission: (state, action) => {
            return action.payload;
        },
    },
})

export const { setTargetSharingEmail } = targetSharingEmail.actions;
export const { setSearchedCoworkers, updateSearchedCoworkerAuthority } = searchedCoworkers.actions;
export const { setCoworkerList, addCoworker, updateCoworkerAuthority, deleteCoworker } = coworkerList.actions;
export const { setSelectedCoworkers, updateAuthority } = selectedCoworkers.actions;
export const { setEditorPermission } = editorPermission.actions;

const reducers = {
    targetSharingEmail: targetSharingEmail.reducer,
    searchedCoworkers: searchedCoworkers.reducer,
    coworkerList: coworkerList.reducer,
    selectedCoworkers: selectedCoworkers.reducer,
    editorPermission: editorPermission.reducer,
}

export default reducers;