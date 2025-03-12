import DemoEditor from "@/components/demo/DemoEditor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getDocumentMetadata } from "@/utils/document/getDocumentMetadata";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const metadata = await getDocumentMetadata(params.id);
    if (!metadata) {
        return redirect('/document-not-found');
    }
    return metadata;
}

export default function DemoPage({ params }: { params: { id: string } }) {
    const docId = params.id;

    try {
        const cookieStore = cookies();
        const demoToken = cookieStore.get('demoToken');

        if (!demoToken) {
            return redirect('/access-denied');
        }

        return <DemoEditor docId={docId} />
    } catch (error) {
        return redirect('/access-denied');
    }
}