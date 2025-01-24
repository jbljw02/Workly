import getTiptapDocument from "./tiptap-document/getTiptapDocument";

// 문서 내용의 경로를 확인 후 조회
const getDocumentContent = async (docId: string, data: any) => {
    try {
        if (data.savePath === 'firestore') {
            return data.docContent;
        }
        else if (data.savePath === 'firebase-storage') {
            const response = await fetch(data.contentUrl);
            return await response.json();
        }
    } catch (error) {
        // Firebase에서 조회 실패 시 Tiptap Cloud에서 조회 시도
        try {
            return await getTiptapDocument(docId);
        } catch (documentError) {
            throw new Error('문서 내용 조회 실패');
        }
    }
};

export default getDocumentContent;