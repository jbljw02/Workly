import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const editorScaleSlice = createSlice({
    name: 'editorScale',
    initialState: 1,
    reducers: {
        setEditorScale: (state, action: PayloadAction<number>) => {
            return action.payload;
        },
        increaseEditorScale: (state) => {
            return state + 0.1;
        },
        decreaseEditorScale: (state) => {
            return state - 0.1;
        },
    },
})

export const { setEditorScale, increaseEditorScale, decreaseEditorScale } = editorScaleSlice.actions;

const reducers = {
    editorScale: editorScaleSlice.reducer,
}

export default reducers;