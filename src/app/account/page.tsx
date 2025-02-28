import Account from "@/components/account/Account";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '계정 관리',
}

export default function AccountPage() {
    return (
        <Account />
    )
}