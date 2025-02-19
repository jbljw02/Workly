import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Crop = {
    unit: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

type ImageDimension = {
    width: number,
    height: number,
}

const cropState: Crop = {
    unit: 'px',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
}

const imageDimensionState = {
    width: 600,
    height: 600,
}

export const imageDimensionSlice = createSlice({
    name: 'imageDimension',
    initialState: imageDimensionState,
    reducers: {
        setImageDimension: (state, action: PayloadAction<ImageDimension>) => {
            return action.payload;
        },
    },
})

export const cropSlice = createSlice({
    name: 'crop',
    initialState: cropState,
    reducers: {
        setCrop: (state, action: PayloadAction<Crop>) => {
            return { ...state, ...action.payload }
        },
    },
})

export const openFullModalSlice = createSlice({
    name: 'openFullModal',
    initialState: false,
    reducers: {
        setOpenFullModal: (state, action) => {
            return action.payload;
        },
    },
})

export const { setImageDimension } = imageDimensionSlice.actions;
export const { setCrop } = cropSlice.actions;
export const { setOpenFullModal } = openFullModalSlice.actions;

const reducers = {
    imageDimension: imageDimensionSlice.reducer,
    crop: cropSlice.reducer,
    openFullModal: openFullModalSlice.reducer,
}

export default reducers;