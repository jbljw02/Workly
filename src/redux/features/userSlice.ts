import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserProps = {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
};

const UserState: UserProps = {
    email: null,
    displayName: null,
    photoURL: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: UserState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProps>) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.photoURL = action.payload.photoURL;
        },
        clearUser: (state) => {
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
        }
    },
})

export const { setUser, clearUser } = userSlice.actions;

const reducers = {
    user: userSlice.reducer,
}

export default reducers;