'use client';

import '@/styles/scrollbar.css';

export default function WebPublishedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full h-screen overflow-hidden">
            {children}
        </div>
    )
}