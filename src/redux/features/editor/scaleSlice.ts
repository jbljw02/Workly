import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const editorScaleSlice = createSlice({
    name: 'editorScale',
    initialState: 1,
    reducers: {
        setEditorScale: (state, action: PayloadAction<number>) => {
            return action.payload;
        },
        increaseEditorScale: (state) => {
            // 최대값을 2로 제한
            return Math.min(state + 0.25, 2);
        },
        decreaseEditorScale: (state) => {
            // 최소값을 0.5로 제한
            return Math.max(state - 0.25, 0.5);
        },
    },
})

export const { setEditorScale, increaseEditorScale, decreaseEditorScale } = editorScaleSlice.actions;

const reducers = {
    editorScale: editorScaleSlice.reducer,
}

export default reducers;