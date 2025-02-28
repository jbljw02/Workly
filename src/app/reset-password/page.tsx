import ResetPassword from "@/components/auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '비밀번호 초기화',
}

export default function ResetPasswordPage() {
    return <ResetPassword />
}