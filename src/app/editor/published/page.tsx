import PublishedDocuments from "@/components/published-documents/PublishedDocuments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '게시된 문서',
}

export default function PublishedPage() {
    return <PublishedDocuments />
}