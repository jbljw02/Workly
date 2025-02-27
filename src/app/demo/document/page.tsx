import AllDocuments from "@/components/all-documents/AllDocuments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '문서 목록',
}

export default function DemoDocumentPage() {
    return (
        <AllDocuments />
    )
}