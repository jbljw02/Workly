'use client';

import Editor from "@/components/editor/Editor";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Editor docId={id} />
    )
}