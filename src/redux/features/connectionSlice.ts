import { createSlice } from "@reduxjs/toolkit";

export const connectionSlice = createSlice({
    name: 'connection',
    initialState: true,
    reducers: {
        setConnection: (state, action) => {
            return action.payload;
        },
    },
});

export const { setConnection } = connectionSlice.actions;

const reducers = {
    connection: connectionSlice.reducer,
}

export default reducers;