import { useEffect, RefObject } from "react";

// ref 영역의 바깥을 클릭하면 해당 ref의 요소를 닫음
export function useClickOutside(
    ref: RefObject<HTMLDivElement>,
    callback: () => void,
    excludedRef?: RefObject<HTMLElement>,
    excludedState?: boolean,
) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // excludedState가 true이면 실행 X
            if (excludedState) {
                return;
            }

            // excludedRef가 있고 클릭한 요소가 excludedRef 안에 있으면 실행 X
            if (excludedRef?.current && excludedRef.current.contains(event.target as Node)) {
                return;
            }

            // ref 바깥을 클릭했을 때 callback 실행
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback, excludedRef, excludedState]);
}
