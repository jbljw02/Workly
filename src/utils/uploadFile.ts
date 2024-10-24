import { Editor } from '@tiptap/react';
import { v4 as uuidv4 } from 'uuid';

const uploadFile = (editor: Editor, file: File, blobUrl: string, pos: number) => {
    editor.chain().insertContentAt(pos, {
        type: 'file',
        attrs: {
            id: uuidv4(),
            href: blobUrl,
            title: file.name,
            mimeType: file.type,
            size: file.size,
        },
    }).focus().run()
}

export default uploadFile;