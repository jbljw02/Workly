import axios from "axios";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

const createTiptapDocument = async (docName: string, docContent: any) => {
    // 빈 문서의 기본 구조 정의
    const emptyDocument = {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                attrs: { textAlign: 'left' }
            }
        ]
    };

    // 문서 내용이 주어지지 않을 경우 빈 문서 할당
    const documentContent = docContent || emptyDocument;

    const response = await axios.post(
        `${wsUrl}/api/documents/${encodeURIComponent(docName)}?format=json`,
        documentContent,
        {
            headers: {
                'Authorization': tiptapCloudSecret,
                'Content-Type': 'application/json'
            },
        }
    );

    return response.data;
}

export default createTiptapDocument;