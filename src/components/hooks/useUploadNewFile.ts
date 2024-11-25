import { Editor } from "@tiptap/react";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default function useUploadNewFile() {
    const uploadNewFile = async (editor: Editor, file: File, src: string, pos: number) => {
        
        const fileAttrs = {
            id: uuidv4(),
            href: src,
            title: file.name,
            mimeType: file.type,
            size: file.size,
        }

        editor.chain().insertContentAt(pos, {
            type: 'file',
            attrs: fileAttrs,
        }).focus().run();

        const storage = getStorage();
        const fileRef = ref(storage, `files/${fileAttrs.id}`);
        await uploadString(fileRef, src, 'data_url');
        const url = await getDownloadURL(fileRef);


    }


    return uploadNewFile;
}