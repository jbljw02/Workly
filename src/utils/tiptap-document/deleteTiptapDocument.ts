import axios from "axios";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

const deleteTiptapDocument = async (docName: string) => {
    try {
        const response = await axios.delete(`${wsUrl}/api/documents/${docName}`, {
            headers: {
              Authorization: tiptapCloudSecret,
            },
          });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export default deleteTiptapDocument;