'use client'

import { useEffect, useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation';

export default function useLeavePage(onLeavePage: () => void | Promise<void>) {
    const router = useRouter()
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const leavePage = useCallback(async () => {
        if (selectedDocument && selectedDocument.id && selectedDocument.docContent) {
            await onLeavePage();
        }
    }, [onLeavePage]);

    useEffect(() => {
        // 브라우저 탭 닫기, 새로고침 감지
        const awareBeforeUnload = (e: BeforeUnloadEvent) => {
            leavePage();
        }

        // 브라우저 탭 변경 감지
        const awareVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                leavePage();
            }
        }

        // 브라우저 뒤로가기/앞으로 가기 감지
        const awarePopState = () => {
            leavePage();
        }

        const originalPush = router.push // 기존 route.push 함수를 저장

        // route.push 함수를 새로운 함수로 덮어씀
        // 페이지를 떠나기 전에 leavePage 함수를 호출을 완료
        router.push = async (href, options) => {
            await leavePage();
            return originalPush(href, options);
        }

        window.addEventListener('beforeunload', awareBeforeUnload)
        document.addEventListener('visibilitychange', awareVisibilityChange)
        window.addEventListener('popstate', awarePopState)

        return () => {
            window.removeEventListener('beforeunload', awareBeforeUnload)
            document.removeEventListener('visibilitychange', awareVisibilityChange)
            window.removeEventListener('popstate', awarePopState)
            router.push = originalPush // 기존 route.push 함수를 복원
        }
    }, [leavePage, router])
}