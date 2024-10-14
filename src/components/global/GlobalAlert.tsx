import { hideCompleteAlert, hideWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CompleteAlert from "../alert/CompleteAlert";
import WarningAlert from "../alert/WarningAlert";

export default function GlobalAlert() {
    const dispatch = useAppDispatch();
    const globalAlert = useAppSelector(state => state.globalAlert);
    return (
        <>
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