import { createSlice } from '@reduxjs/toolkit';

export const selectedNodeSlice = createSlice({
    name: 'selectedNode',
    initialState: null,
    reducers: {
        setSelectedNode: (state, action) => {
            return action.payload;
        },
    },
});

export const { setSelectedNode } = selectedNodeSlice.actions;


const reducers = {
    selectedNode: selectedNodeSlice.reducer,
}

export default reducers;