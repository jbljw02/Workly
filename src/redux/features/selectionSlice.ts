import { createSlice } from "@reduxjs/toolkit";

type TextSelection = {
    text: string;
    range: {
        start: number | null;
        end: number | null;
    },
}

const textSelectionState = {
    text: '',
    range: {
        start: null,
        end: null,
    },
}


export const textSelectionSlice = createSlice({
    name: 'textSelection',
    initialState: textSelectionState,
    reducers: {
        setTextSelection: (state, action) => {
            state.text = action.payload.text;
            state.range = action.payload.range;
        },
        clearTextSelection: (state) => {
            state.text = '';
            state.range.start = null;
            state.range.end = null;
        },
    }
})

export const { setTextSelection, clearTextSelection } = textSelectionSlice.actions;

const reducers = {
    textSelection: textSelectionSlice.reducer,
}

export default reducers;