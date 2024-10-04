'use client';

import Editor from "@/components/editor/Editor";
import { useAppSelector } from "@/redux/hooks";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Editor docId={id} />
    )
}