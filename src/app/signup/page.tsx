import SignUp from "@/components/auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '회원가입',
}

export default function Page() {
    return (
        <SignUp />
    )
}