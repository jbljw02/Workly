import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImage, ResizableImageHTMLAttributes } from "tiptap-extension-resizable-image";
import { Plugin, PluginKey } from "prosemirror-state"; // Plugin을 prosemirror-state에서 가져옴
import ImageNodeView from "@/components/editor/child/image/ImageNodeView";

export type ImageMetadata = {
  id: string;
  width: string;
  height: string;
  title: string;
  alt: string;
  textAlign: string;
}

// ResizableImageHTMLAttributes 타입을 ID를 포함하여 확장
export interface IdIncluededResizableImagAttrs extends ResizableImageHTMLAttributes {
  id: string;
  textAlign: string;
}

// 확장된 인터페이스를 적용하여 SetResizableImageProps 타입 재정의
export type SetResizableImageProps = (
  attrs: IdIncluededResizableImagAttrs,
  position?: number | Range,
) => boolean;

export type ImageAttrs = ImageMetadata & {
  className: string;
  'data-keep-ratio': boolean;
  src: string;
}

const ImageNode = ResizableImage.extend({
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView as any);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<any>({
        key: new PluginKey('imageNodeDragDrop'), // 플러그인에 고유 키를 부여
        props: {
          handleDOMEvents: {
            dragstart: (view, event) => {
              // 드래그 시작 시 복사 방지
              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move'; // 이동 모드로 변경
              }
              return false; // 기본 동작을 막지 않음
            },
            drop: (view, event) => {
              // 드롭 시 복사 방지
              event.preventDefault(); // 기본 드롭 동작을 막음
              return false;
            },
          },
        },
      }),
    ];
  },
});

export default ImageNode;