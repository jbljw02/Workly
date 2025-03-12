import DemoEditor from "@/components/demo/DemoEditor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Workly',
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