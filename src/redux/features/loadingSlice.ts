import { createSlice } from "@reduxjs/toolkit";

export const isDeletingSlice = createSlice({
    name: 'isDeleting',
    initialState: false,
    reducers: {
        setIsDeleting: (state, action) => action.payload,
    },
});

export const { setIsDeleting } = isDeletingSlice.actions;

const reducers = {
    isDeleting: isDeletingSlice.reducer,
}

export default reducers;