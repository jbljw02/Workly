import { createSlice } from "@reduxjs/toolkit";

export const workingSpinnerSlice = createSlice({
    name: 'workingSpinner',
    initialState: false,
    reducers: {
        setWorkingSpinner: (state, action) => {
            return action.payload;
        }
    }
})

export const { setWorkingSpinner } = workingSpinnerSlice.actions;

const reducers = {
    workingSpinner: workingSpinnerSlice.reducer
}

export default reducers;