'use client'

import '@/styles/global.css'
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import EmailVerifyCheck from '@/components/global/EmailVerifyCheck';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import GlobalAlert from '@/components/global/GlobalAlert';
import Modal from 'react-modal';

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
    Modal.setAppElement('body');

    return (
        <html lang="en" className="w-full h-full text-[#212121]">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body className="min-w-full min-h-screen">
                <Provider store={storeRef.current}>
                    <EmailVerifyCheck />
                    <GlobalAlert />
                    {children}
                    <ProgressBar
                        height="2.5px"
                        color="#29D"
                        options={{ showSpinner: true }}
                        startPosition={0}
                        stopDelay={200}
                        disableSameURL={true}
                    />
                </Provider>
            </body>
        </html>
    );
}