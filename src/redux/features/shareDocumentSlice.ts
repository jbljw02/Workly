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
            const coworker = state.find(coworker => coworker.email === email);
            if (coworker) {
                coworker.authority = newAuthority;
            }
        }
    },
})

export const selectedCoworkers = createSlice({
    name: 'selectedCoworkers',
    initialState: [] as Collaborator[],
    reducers: {
        setSelectedCoworkers: (state, action) => {
            return action.payload;
        }
    },
})

export const { setTargetSharingEmail } = targetSharingEmail.actions;
export const { setCoworkerList, addCoworker, updateCoworkerAuthority } = coworkerList.actions;
export const { setSelectedCoworkers } = selectedCoworkers.actions;

const reducers = {
    targetSharingEmail: targetSharingEmail.reducer,
    coworkerList: coworkerList.reducer,
    selectedCoworkers: selectedCoworkers.reducer,
}

export default reducers;