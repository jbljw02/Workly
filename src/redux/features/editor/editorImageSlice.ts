import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Crop = {
    unit: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

type CropMode = {
    isActive: boolean;
    imageId: string | null;
}

type ImageDimension = {
    width: number,
    height: number,
    naturalWidth: number,
    naturalHeight: number,
}

const cropState: Crop = {
    unit: 'px',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
}

const cropModeState: CropMode = {
    isActive: false,
    imageId: null
}

const imageDimensionState = {
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
}

export const imageDimensionSlice = createSlice({
    name: 'imageDimension',
    initialState: imageDimensionState,
    reducers: {
        setImageDimension: (state, action: PayloadAction<ImageDimension>) => {
            return { ...state, ...action.payload };
        },
    },
})

export const cropModeSlice = createSlice({
    name: 'cropMode',
    initialState: cropModeState,
    reducers: {
        setCropMode: (state, action: PayloadAction<CropMode>) => {
            state.isActive = action.payload.isActive;
            state.imageId = action.payload.imageId;
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
export const { setCropMode } = cropModeSlice.actions;

const reducers = {
    imageDimension: imageDimensionSlice.reducer,
    crop: cropSlice.reducer,
    openFullModal: openFullModalSlice.reducer,
    cropMode: cropModeSlice.reducer,
}

export default reducers;