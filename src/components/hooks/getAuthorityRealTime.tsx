import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import firestore from '@/firebase/firestore';

function useCollaboratorListener(docId: string) {
    const dispatch = useAppDispatch();
    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    useEffect(() => {
        const docRef = doc(firestore, 'documents', docId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            console.log("동작")
            if (docSnap.exists()) {
                const data = docSnap.data();
                const currentCollaborators = data.collaborators || [];

                // 이전 상태와 비교하여 변경이 있을 때만 업데이트
                if (JSON.stringify(selectedDocument.collaborators) !== JSON.stringify(currentCollaborators)) {
                    //   setPrevCollaborators(currentCollaborators);
                    //   dispatch(setCollaborators(currentCollaborators));
                    console.log("협업자변경:", currentCollaborators);
                }
            }
        });

        return () => unsubscribe();
    }, [docId, dispatch, selectedDocument.collaborators]);

    return selectedDocument.collaborators;
}

export default useCollaboratorListener;