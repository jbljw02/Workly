'use client';

import CompleteAlert from "@/components/alert/CompleteAlert";
import WarningAlert from "@/components/alert/WarningAlert";
import Editor from "@/components/editor/Editor";
import { hideCompleteAlert, hideWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();

    const globalAlert = useAppSelector(state => state.globalAlert);

    return (
        <>
            <Editor docId={id} />
            <CompleteAlert
                isModalOpen={globalAlert.completeAlert.isOpen}
                setIsModalOpen={() => dispatch(hideCompleteAlert())}
                label={globalAlert.completeAlert.message} />
            <WarningAlert
                isModalOpen={globalAlert.warningAlert.isOpen}
                setIsModalOpen={() => dispatch(hideWarningAlert())}
                label={globalAlert.warningAlert.message} />
        </>
    )
}