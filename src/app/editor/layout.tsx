'use client';

import GlobalAlert from "@/components/global/GlobalAlert";
import useGetUserData from "@/components/hooks/useGetUserData";
import useGetAllUsers from "@/components/hooks/useGetAllUsers";
import Aside from "@/components/aside/Aside";
import '@/styles/scrollbar.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    useGetUserData();
    useGetAllUsers();
    return (
        <div className="flex flex-row w-full min-h-screen">
            <GlobalAlert />
            <Aside />
            {children}
        </div>
    )
}