import DocumentNotFound from "@/components/document-not-found/DocumentNotFound";
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '존재하지 않는 문서',
}

export default function Page() {
    return <DocumentNotFound />;
}