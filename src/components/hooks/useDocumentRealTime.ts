import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import firestore from '@/firebase/firestore';
import { updateDocuments } from '@/redux/features/documentSlice';
import convertTimestamp from '@/utils/convertTimestamp';
import { UserProps } from '@/redux/features/userSlice';
import { useRouter } from 'next-nprogress-bar';

export default function useDocumentRealTime({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector(state => state.user);

    // onSnapshot을 이용해 문서의 실시간 변경을 감지
    useEffect(() => {
        const docRef = doc(firestore, 'documents', docId); // 현재 문서의 참조를 가져옴

        // 현재 참조 중인 문서가 변경될 때마다 변경사항 업데이트
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const documentData = docSnap.data();

                // 사용자가 협업자 목록에 있는지 확인
                const isCollaborator = documentData.collaborators.some((collaborator: UserProps) => collaborator.email === user.email);
                // 사용자가 관리자인지 확인
                const isAuthor = documentData.author.email === user.email;

                // 협업자도 아니며 관리자도 아니라면 404 페이지로 리다이렉트
                if (!isCollaborator && !isAuthor) {
                    router.push('/access-denied');
                    return;
                }

                const convertedData = {
                    ...documentData,
                    createdAt: convertTimestamp(documentData.createdAt),
                    readedAt: convertTimestamp(documentData.readedAt),
                    publishedDate: documentData.publishedDate ? convertTimestamp(documentData.publishedDate) : undefined,
                }

                dispatch(updateDocuments({ docId: docId, ...convertedData }));
            }
            // 문서가 존재하지 않거나 삭제됐다면 404 페이지로 리다이렉트
            else {
                router.push('/document-not-found');
            }
        });

        return () => unsubscribe();
    }, [docId, dispatch, user]);
}