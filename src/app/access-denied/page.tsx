import AccessDenied from "@/components/access-denied/AccessDenied";
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '접근 불가',
}

export default function Page() {
    return <AccessDenied />
}