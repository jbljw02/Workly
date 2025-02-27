import { ConnectedUser } from "@/types/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialConnectedUsers: ConnectedUser[] = [];

export const connectedUsersSlice = createSlice({
    name: 'connectedUsers',
    initialState: initialConnectedUsers,
    reducers: {
        setConnectedUsers: (state, action: PayloadAction<ConnectedUser[]>) => {
            return action.payload;
        },
        setDemoConnectedUsers: (state, action: PayloadAction<ConnectedUser>) => {
            state.push(action.payload);
        },
    },
})

export const connectionSlice = createSlice({
    name: 'connection',
    initialState: true,
    reducers: {
        setConnection: (state, action) => {
            return action.payload;
        },
    },
});

export const docSyncedSlice = createSlice({
    name: 'docSynced',
    initialState: false,
    reducers: {
        setDocSynced: (state, action) => {
            return action.payload;
        },
    },
});

export const { setConnectedUsers, setDemoConnectedUsers } = connectedUsersSlice.actions;
export const { setConnection } = connectionSlice.actions;
export const { setDocSynced } = docSyncedSlice.actions;

const reducers = {
    connection: connectionSlice.reducer,
    connectedUsers: connectedUsersSlice.reducer,
    docSynced: docSyncedSlice.reducer,
}

export default reducers;