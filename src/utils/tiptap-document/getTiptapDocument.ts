import axios from "axios";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

const getTiptapDocument = async (docName: string) => {
    try {
        const response = await axios.get(`${wsUrl}/api/documents/${docName}?format=json`, {
            headers: {
                'Authorization': tiptapCloudSecret,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default getTiptapDocument;