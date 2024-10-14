'use client';

import CompleteAlert from "@/components/alert/CompleteAlert";
import WarningAlert from "@/components/alert/WarningAlert";
import Editor from "@/components/editor/Editor";
import { hideCompleteAlert, hideWarningAlert } from "@/redux/features/alertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Editor docId={id} />
    )
}