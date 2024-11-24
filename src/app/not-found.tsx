import NotFound from "@/components/not-found/NotFound"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '잘못된 경로',
}

export default function Page() {
    return <NotFound />
}