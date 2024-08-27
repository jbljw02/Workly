import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LinkTooltip = {
    href: string,
    position: { top: number, left: number },
    visible: boolean,
}

const linkTooltipState = {
    href: '',
    position: { top: 0, left: 0 },
    visible: false,
}

export const linkTooltipSlice = createSlice({
    name: 'linkTooltip',
    initialState: linkTooltipState,
    reducers: {
        setLinkTooltip: (state, action: PayloadAction<LinkTooltip>) => {
            return action.payload;
        },
    },
})

export const { setLinkTooltip } = linkTooltipSlice.actions;

const reducers = {
    linkTooltip: linkTooltipSlice.reducer,
}

export default reducers;