import { useEffect, RefObject } from "react";

// ref 영역의 바깥을 클릭하면 해당 ref의 요소를 닫음
export function useClickOutside(ref: RefObject<HTMLElement>, callback: () => void) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
}
