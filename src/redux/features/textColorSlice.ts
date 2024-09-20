import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const textColorSlice = createSlice({
    name: 'textColor',
    initialState: '#444444',
    reducers: {
        setTextColor: (state, action: PayloadAction<string>) => {
            return action.payload;
        },
    },
})

export const openColorPickerSlice = createSlice({
    name: 'openColorPicker',
    initialState: false,
    reducers: {
        setOpenColorPicker: (state, action: PayloadAction<boolean>) => {
            return action.payload;
        },
    },
})

export const { setTextColor } = textColorSlice.actions;
export const { setOpenColorPicker } = openColorPickerSlice.actions;

const reducers = {
    textColor: textColorSlice.reducer,
    openColorPicker: openColorPickerSlice.reducer,
}

export default reducers;