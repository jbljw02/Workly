'use client'

import '@/styles/global.css'
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import Aside from '@/components/aside/Aside';
import { useAppDispatch } from '@/redux/hooks';
import EmailVerifyCheck from '@/components/global/EmailVerifyCheck';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // 첫 렌더링 시에 스토어를 생성
    storeRef.current = makeStore();
  }

  return (
    <html lang="en" className="w-full h-full text-[#212121]">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen">
        <Provider store={storeRef.current}>
          {/* <Aside /> */}
          <EmailVerifyCheck />
          {children}
        </Provider>
      </body>
    </html>
  );
}