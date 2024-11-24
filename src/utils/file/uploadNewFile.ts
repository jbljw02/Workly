import { Editor } from '@tiptap/react';
import { v4 as uuidv4 } from 'uuid';

const uploadNewFile = async (editor: Editor, file: File, src: string, pos: number) => {
    editor.chain().insertContentAt(pos, {
        type: 'file',
        attrs: {
            id: uuidv4(),
            href: src,
            title: file.name,
            mimeType: file.type,
            size: file.size,
        },
    }).focus().run();
}

export default uploadNewFile;