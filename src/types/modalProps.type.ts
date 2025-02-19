import { DocumentProps } from "@/types/document.type";

export type ModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NoticeModalProps extends ModalProps {
    label: string | React.ReactNode;
}

export interface WorkingDocModalProps extends ModalProps {
    selectedDoc: DocumentProps;
}