import Login from '@/components/auth/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '로그인',
}

export default function Page() {
    return (
        <Login />
    )
}