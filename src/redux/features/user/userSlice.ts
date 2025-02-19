import { UserProps } from "@/types/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const UserState: UserProps = {
    email: '',
    displayName: '',
    photoURL: '',
    uid: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState: UserState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProps>) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.photoURL = action.payload.photoURL;
            state.uid = action.payload.uid;
        },
        clearUser: (state) => {
            state.email = '';
            state.displayName = '';
            state.photoURL = '';
            state.uid = '';
        }
    },
})

export const allUsers = createSlice({
    name: 'allUsers',
    initialState: [] as UserProps[],
    reducers: {
        setAllUsers: (state, action: PayloadAction<UserProps[]>) => {
            return action.payload;
        }
    },
})

export const { setUser, clearUser } = userSlice.actions;
export const { setAllUsers } = allUsers.actions;

const reducers = {
    user: userSlice.reducer,
    allUsers: allUsers.reducer,
}

export default reducers;