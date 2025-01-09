import firestore from '@/firebase/firestore';
import { doc, writeBatch, serverTimestamp, collection, getDocs, limit, query } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { NextResponse } from 'next/server';

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

export async function POST() {
    const storage = getStorage();
    const batchSize = 10;
    const totalDocuments = 50;

    try {
        // 기본 문서 내용
        const defaultContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    attrs: { textAlign: 'left' },
                    content: [{ type: 'text', text: 'Test document content' }]
                }
            ]
        };

        const testUser = {
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/avatar.png'
        };

        for (let i = 0; i < totalDocuments; i += batchSize) {
            const batch = writeBatch(firestore);
            const currentBatchSize = Math.min(batchSize, totalDocuments - i);

            // 배치 내의 각 문서 생성
            for (let j = 0; j < currentBatchSize; j++) {
                const docId = uuidv4();
                const docRef = doc(firestore, 'documents', docId);

                // 1. Storage에 문서 내용 업로드
                const contentRef = ref(storage, `documents/${docId}/drafts/content.json`);
                await uploadString(contentRef, JSON.stringify(defaultContent));
                const contentUrl = await getDownloadURL(contentRef);

                // 2. Tiptap Cloud에 문서 생성
                await axios.post(
                    `${wsUrl}/api/documents/${encodeURIComponent(docId)}?format=json`,
                    defaultContent,
                    {
                        headers: {
                            'Authorization': tiptapCloudSecret,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                // 3. Firestore 문서 데이터 준비
                const documentData = {
                    id: docId,
                    title: `Test Document ${i + j + 1}`,
                    contentUrl,
                    createdAt: serverTimestamp(),
                    readedAt: serverTimestamp(),
                    author: testUser,
                    folderId: 'test-folder',
                    folderName: 'Test Folder',
                    collaborators: [],
                    shortcutsUsers: [],
                    isPublished: false,
                    publishedUser: null,
                    publishedDate: null,
                };

                batch.set(docRef, documentData);
            }

            // 배치 커밋
            await batch.commit();
            console.log(`Batch ${Math.floor(i / batchSize) + 1} completed`);
        }

        console.log('All test documents created successfully');
        return new Response('Success', { status: 200 });
    } catch (error) {
        console.error('Error creating test documents:', error);
        return new Response('Error', { status: 500 });
    }
}



export async function GET() {
    const startTime = performance.now();

    try {
        // 1. Firestore에서 50개 문서의 ID만 조회
        const q = query(collection(firestore, 'documents'), limit(50));
        const documentsSnapshot = await getDocs(q);
        const documentIds = documentsSnapshot.docs.map(doc => doc.id);

        // 2. 각 문서 ID로 Tiptap Cloud에서 문서 내용 조회
        const documents = await Promise.all(documentIds.map(async docId => {
            const response = await axios.get(`${wsUrl}/api/documents/${docId}`, {
                headers: {
                    'Authorization': tiptapCloudSecret
                }
            });

            const docData = documentsSnapshot.docs.find(doc => doc.id === docId)?.data();
            return {
                id: docId,
                title: docData?.title,
                docContent: response.data,
                createdAt: docData?.createdAt,
                readedAt: docData?.readedAt,
                author: docData?.author,
                folderId: docData?.folderId,
                folderName: docData?.folderName,
                collaborators: docData?.collaborators || [],
                shortcutsUsers: docData?.shortcutsUsers || [],
            };
        }));

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return NextResponse.json({
            count: documents.length,
            executionTime: `${executionTime}ms`,
            documents
        });
    } catch (error) {
        return NextResponse.json({ error: "문서 조회 실패" }, { status: 500 });
    }
}