import { Editor } from '@tiptap/react';
import { v4 as uuidv4 } from 'uuid';
import uploadImageToStorage from './image/uploadImageToStorage';
import { SetResizableImageProps } from '../../lib/ImageNode';

export default async function uploadImage(editor: Editor, file: File, src: string) {
    const imgAttrs = await uploadImageToStorage({
        id: uuidv4(),
        src: src,
        alt: '',
        title: file.name,   
        width: '600',
        height: '600',
        'data-keep-ratio': true,
        className: 'resizable-img',
        textAlign: 'left',
    });

    (editor.commands.setResizableImage as SetResizableImageProps)({
        id: imgAttrs.id,
        src: imgAttrs.src,
        alt: imgAttrs.alt,
        title: imgAttrs.title,
        width: Number(imgAttrs.width),
        height: Number(imgAttrs.height),
        'data-keep-ratio': true,
        className: 'resizable-img',
        textAlign: 'left',
    })
}