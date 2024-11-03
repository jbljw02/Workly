'use client';

import GlobalAlert from "@/components/global/GlobalAlert";
import useGetUserData from "@/components/hooks/useGetUserData";
import useGetAllUsers from "@/components/hooks/useGetAllUsers";
import { useAppSelector } from "@/redux/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
    useGetUserData();
    useGetAllUsers();
    return (
        <body>
            <GlobalAlert />
            {children}
        </body>
    )
}