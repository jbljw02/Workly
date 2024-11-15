'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'

export default function useLeavePage(onLeavePage: () => void | Promise<void>) {
    const router = useRouter()
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const leavePage = useCallback(async () => {
        try {
            if (selectedDocument && selectedDocument.id) {
                await onLeavePage()
            }
        } catch (error) {
            console.error('페이지를 떠나는 도중 에러 발생: ', error)
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
        // 페이지를 떠나기 전에 leavePage 함수를 호출하고 기존 route.push 함수를 호출
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