import EditorHome from "@/components/editor-home/EditorHome";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Workly',
}

export default function EditorHomePage() {
    return (
        <EditorHome />
    )
}