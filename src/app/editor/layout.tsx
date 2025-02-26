'use client';

import useGetUserData from "@/hooks/user/useGetUserData";
import useGetAllUsers from "@/hooks/user/useGetAllUsers";
import Aside from "@/components/aside/Aside";
import '@/styles/scrollbar.css';
import FailedModal from "@/components/modal/FailedModal";
import useLogoutDemoUser from "@/hooks/user/useLogoutDemoUser";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    useGetUserData();
    useGetAllUsers();
    useLogoutDemoUser();
    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <FailedModal />
            <Aside />
            {children}
        </div>
    )
}