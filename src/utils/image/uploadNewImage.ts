import { SetResizableImageProps } from "../../../lib/ImageNode";
import getDimensions from "./getDimensions";
import { Editor } from "@tiptap/react";
import { v4 as uuidv4 } from 'uuid';

const uploadNewImage = async (editor: Editor, title: string, src: string) => {
    const dimensions = await getDimensions(src); // 이미지 크기 계산

    const imageAttrs = {
        id: uuidv4(),
        src: src,
        title: title,
        width: dimensions.width,
        height: dimensions.height,
        className: 'resizable-img',
        'data-keep-ratio': true,
        textAlign: 'left',
        alt: '',
    };

    (editor.commands.setResizableImage as SetResizableImageProps)(imageAttrs);
};

export default uploadNewImage;