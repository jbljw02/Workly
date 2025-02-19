import { createSlice } from "@reduxjs/toolkit";

export const webPublishedSlice = createSlice({
    name: 'webPublished',
    initialState: false,
    reducers: {
        setWebPublished: (state, action) => {
            return action.payload;
        },
    },
})

export const { setWebPublished } = webPublishedSlice.actions;

const reducers = {
    webPublished: webPublishedSlice.reducer,
}

export default reducers;