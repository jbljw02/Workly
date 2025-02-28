import Contact from "@/components/contact/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '문의하기',
}

export default function ContactPage() {
    return <Contact />;
}