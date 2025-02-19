import { createSlice } from "@reduxjs/toolkit";
import { Collaborator } from "../../../types/document.type";

export const targetSharingEmailSlice = createSlice({
    name: 'targetSharingEmail',
    initialState: '',
    reducers: {
        setTargetSharingEmail: (state, action) => {
            return action.payload;
        }
    },
})

export const searchedCoworkersSlice = createSlice({
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

export const coworkerListSlice = createSlice({
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

export const selectedCoworkersSlice = createSlice({
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

export const editorPermissionSlice = createSlice({
    name: 'editorPermission',
    initialState: null,
    reducers: {
        setEditorPermission: (state, action) => {
            return action.payload;
        },
    },
})

export const { setTargetSharingEmail } = targetSharingEmailSlice.actions;
export const { setSearchedCoworkers, updateSearchedCoworkerAuthority } = searchedCoworkersSlice.actions;
export const { setCoworkerList, addCoworker, updateCoworkerAuthority, deleteCoworker } = coworkerListSlice.actions;
export const { setSelectedCoworkers, updateAuthority } = selectedCoworkersSlice.actions;
export const { setEditorPermission } = editorPermissionSlice.actions;

const reducers = {
    targetSharingEmail: targetSharingEmailSlice.reducer,
    searchedCoworkers: searchedCoworkersSlice.reducer,
    coworkerList: coworkerListSlice.reducer,
    selectedCoworkers: selectedCoworkersSlice.reducer,
    editorPermission: editorPermissionSlice.reducer,
}

export default reducers;