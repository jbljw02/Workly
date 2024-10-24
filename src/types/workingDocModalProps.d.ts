import { ModalProps } from "./modalProps";
import { DocumentProps } from "@/redux/features/documentSlice";

export interface WorkingDocModalProps extends ModalProps {
    selectedDoc: DocumentProps;
}