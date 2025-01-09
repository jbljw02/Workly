import axios from "axios";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

const getTiptapDocument = async (docName: string) => {
    try {
        const response = await axios.get(`${wsUrl}/api/documents/${docName}?format=yjs`, {
          headers: {
            Authorization: tiptapCloudSecret,
            },
            responseType: 'json',
            timeout: 5000,
        });

        console.log('response', response.data);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default getTiptapDocument;