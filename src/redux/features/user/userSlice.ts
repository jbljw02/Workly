import { UserProps } from "@/types/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const UserState: UserProps = {
    email: '',
    displayName: '',
    photoURL: '',
    uid: '',
    isDemo: false,
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
        },
        setDemoUser: (state, action) => {
            state.email = 'guest@workly.kr';
            state.displayName = '게스트';
            state.photoURL = action.payload.photoURL;
            state.uid = action.payload.uid;
            state.isDemo = true;
        },
        clearDemoUser: (state) => {
            state.email = '';
            state.displayName = '';
            state.photoURL = '';
            state.uid = '';
            state.isDemo = false;
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

export const { setUser, clearUser, setDemoUser, clearDemoUser } = userSlice.actions;
export const { setAllUsers } = allUsers.actions;

const reducers = {
    user: userSlice.reducer,
    allUsers: allUsers.reducer,
}

export default reducers;