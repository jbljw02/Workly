import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
    completeAlert: {
        isOpen: boolean;
        message: string;
    };
    warningAlert: {
        isOpen: boolean;
        message: string;
    };
}

const initialState: AlertState = {
    completeAlert: {
        isOpen: false,
        message: '',
    },
    warningAlert: {
        isOpen: false,
        message: '',
    },
};

const globalAlertSlice = createSlice({
    name: 'globalAlert',
    initialState,
    reducers: {
        showCompleteAlert: (state, action: PayloadAction<string>) => {
            state.completeAlert.isOpen = true;
            state.completeAlert.message = action.payload;
        },
        hideCompleteAlert: (state) => {
            state.completeAlert.isOpen = false;
            state.completeAlert.message = '';
        },
        showWarningAlert: (state, action: PayloadAction<string>) => {
            state.warningAlert.isOpen = true;
            state.warningAlert.message = action.payload;
        },
        hideWarningAlert: (state) => {
            state.warningAlert.isOpen = false;
            state.warningAlert.message = '';
        },
    },
});

const failedAlertSlice = createSlice({
    name: 'failedAlert',
    initialState: false,
    reducers: {
        setFailedAlert: (state, action: PayloadAction<boolean>) => {
            return action.payload;
        },
    },
});

export const { showCompleteAlert, hideCompleteAlert, showWarningAlert, hideWarningAlert } = globalAlertSlice.actions;
export const { setFailedAlert } = failedAlertSlice.actions;

const reducers = {
    globalAlert: globalAlertSlice.reducer,
    failedAlert: failedAlertSlice.reducer,
}

export default reducers;