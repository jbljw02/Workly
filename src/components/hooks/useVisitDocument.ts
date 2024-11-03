'use client';

import axios from "axios";
import { useEffect } from "react";

export default function useVisitDocument({ docId }: { docId: string }) {
    // 사용자가 문서를 방문하면 열람일 업데이트
    useEffect(() => {
        const visitDocument = async () => {
            if (!docId) return;

            try {
                await axios.patch('/api/document', {
                    docId: docId,
                });
            } catch (error) {
                console.error(error);
            }
        };

        visitDocument();
    }, [docId]);
}