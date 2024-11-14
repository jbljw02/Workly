import { useEffect } from 'react';

// 특정 컴포넌트가 열려있을 때 뒤에 있는 요소들의 상호작용을 막음
export default function useOverlayLock(isLocked: boolean) {
    useEffect(() => {
        if (isLocked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLocked]);
}