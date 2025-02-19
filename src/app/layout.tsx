'use client'

import '@/styles/global.css'
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import EmailVerifyCheck from '@/components/global/EmailVerifyCheck';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import GlobalAlert from '@/components/global/GlobalAlert';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

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
            options={{ showSpinner: true }} // 로딩 스피너 표시
            startPosition={0} // 프로그레스 바 시작 위치
            stopDelay={200} // 프로그레스 바가 완료된 후 사라지는 지연 시간(200ms)
            disableSameURL={true} // 같은 URL로 이동할 때는 비활성화
          />
        </Provider>
      </body>
    </html>
  );
}