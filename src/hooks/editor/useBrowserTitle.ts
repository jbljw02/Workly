import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

export default function useBrowserTitle(docTitle: string) {
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    // 브라우저 탭 타이틀 업데이트
    // 메타데이터가 불필요한 상황이기 때문에 useEffect를 사용해 업데이트
    useEffect(() => {
        const title = docTitle || selectedDocument?.title;
        if (title) {
            document.title = title
        } else {
            document.title = '제목 없는 문서';
        }
    }, [docTitle, selectedDocument?.title]);
}