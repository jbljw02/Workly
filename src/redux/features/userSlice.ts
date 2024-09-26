import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserProps = {
    email: string;
    displayName: string;
    photoURL: string;
};

const UserState: UserProps = {
    email: '',
    displayName: '',
    photoURL: '',
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
            state.email = '';
            state.displayName = '';
            state.photoURL = '';
        }
    },
})

export const { setUser, clearUser } = userSlice.actions;

const reducers = {
    user: userSlice.reducer,
}

export default reducers;