'use client';

import GlobalAlert from "@/components/global/GlobalAlert";
import useGetUserData from "@/components/hooks/useGetUserData";
import useGetAllUsers from "@/components/hooks/useGetAllUsers";
import Aside from "@/components/aside/Aside";
import '@/styles/scrollbar.css';
import FailedModal from "@/components/modal/FailedModal";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    useGetUserData();
    useGetAllUsers();
    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <GlobalAlert />
            <FailedModal />
            <Aside />
            {children}
        </div>
    )
}