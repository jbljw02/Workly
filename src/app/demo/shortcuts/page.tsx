import ShortcutDocuments from "@/components/shortcuts-documents/ShortcutDocuments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '즐겨찾기',
}

export default function EditorShortcutsPage() {
    return <ShortcutDocuments />
}