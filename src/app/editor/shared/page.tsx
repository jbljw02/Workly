import ShareDocument from "@/components/shared-documents/SharedDocuments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '공유중인 문서',
}

export default function EditorSharedPage() {
    return (
        <ShareDocument />
    )
}