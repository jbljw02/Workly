'use client';

import useCheckDemoCookie from "@/hooks/demo/useCheckDemoCookie";
import DemoNotice from "@/components/demo/DemoNotice";
import Aside from "@/components/aside/Aside";
import '@/styles/scrollbar.css';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    useCheckDemoCookie();
    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <Aside />
            <DemoNotice />
            {children}
        </div>
    )
}