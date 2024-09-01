import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LinkTooltip = {
    id: string,
    href: string,
    text: string,
    position: { top: number, left: number },
    visible: boolean,
}

const linkTooltipState = {
    id: '',
    href: '',
    text: '',
    position: { top: 0, left: 0 },
    visible: false,
}

export const linkTooltipSlice = createSlice({
    name: 'linkTooltip',
    initialState: linkTooltipState,
    reducers: {
        setLinkTooltip: (state, action: PayloadAction<Partial<LinkTooltip>>) => {
            return { ...state, ...action.payload };
        },
    },
})

export const { setLinkTooltip } = linkTooltipSlice.actions;

const reducers = {
    linkTooltip: linkTooltipSlice.reducer,
}

export default reducers;