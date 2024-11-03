import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import firestore from '@/firebase/firestore';
import { updateDocuments } from '@/redux/features/documentSlice';
import { redirect, useRouter } from 'next/navigation';

export default function useDocumentRealTime({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // onSnapshot을 이용해 문서의 실시간 변경을 감지
    useEffect(() => {
        const docRef = doc(firestore, 'documents', docId); // 현재 문서의 참조를 가져옴

        // 현재 참조 중인 문서가 변경될 때마다 변경사항 업데이트
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const documentData = docSnap.data();

                // Timestamp를 순수 객체로 변환
                const convertTimestamp = (timestamp: Timestamp) => ({
                    seconds: timestamp.seconds,
                    nanoseconds: timestamp.nanoseconds,
                });

                const convertedData = {
                    ...documentData,
                    createdAt: convertTimestamp(documentData.createdAt),
                    readedAt: convertTimestamp(documentData.readedAt),
                };

                dispatch(updateDocuments({ docId: docId, ...convertedData }));
            }
            // 문서가 존재하지 않거나 삭제됐다면 404 페이지로 리다이렉트
            else {
                router.push('/document-not-found');
            }
        });

        return () => unsubscribe();
    }, [docId, dispatch]);
}