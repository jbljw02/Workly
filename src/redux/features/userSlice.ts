import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    email: string | null;
    name: string | null;
}

const UserState: User = {
    email: null,
    name: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: UserState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return action.payload;
        },
    },
})

export const { setUser } = userSlice.actions;

const reducers = {
    user: userSlice.reducer,
}

export default reducers;