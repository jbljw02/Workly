import { useAppDispatch } from "@/redux/hooks";
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Placeholder from '@tiptap/extension-placeholder'
import ImageNodeView from '@/components/editor/child/image/ImageNodeView'
import { LinkTooltip, setLinkTooltip } from '@/redux/features/editor/linkSlice'
import { FontSize } from "@/lib/fontSize";
import { FontFamily } from "@/lib/fontFamily";
import LinkNode from "@/lib/linkNode";
import FileNode from "@/lib/fileNode";
import '@/styles/editor.css'
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import FileHandler from '@tiptap-pro/extension-file-handler'
import { Editor } from "@tiptap/react";
import useUploadImage from "./useUploadImage";
import useUploadFile from "./useUploadFile";
import { EnsureLastParagraph } from "../../lib/ensureLastParagraph";
import CustomTextMark from "../../lib/textMark";
import DragHandle from '@tiptap-pro/extension-drag-handle'

export default function useCommonExtension() {
    const dispatch = useAppDispatch();
    const uploadNewImage = useUploadImage();
    const uploadNewFile = useUploadFile();

    const extensions = [
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: true,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: true,
            },
            history: false,
        }),
        Strike,
        Document,
        Underline,
        Highlight.configure({
            multicolor: true,
            HTMLAttributes: {
                class: 'highlight',
            },
        }),
        TextStyle,
        Color,
        ListItem,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Blockquote,
        FontSize,
        FontFamily,
        EnsureLastParagraph,
        LinkNode.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            setLinkTooltip: (payload: Partial<LinkTooltip>) => dispatch(setLinkTooltip(payload)),
        }),
        Dropcursor,
        CustomTextMark,
        DragHandle,
        ImageNodeView,
        FileNode,
        FileHandler.configure({
            onDrop: (currentEditor: Editor, files: File[], pos: number) => {
                files.forEach(file => {
                    const fileReader = new FileReader()
                    fileReader.onload = async () => {
                        const src = fileReader.result as string

                        if (file.type.startsWith('image/')) {
                            uploadNewImage(currentEditor, file, src)
                        } else {
                            uploadNewFile(currentEditor, file, pos)
                        }
                    }
                    fileReader.readAsDataURL(file)
                })
            },
        }),
        Placeholder.configure({
            placeholder: ({ node, editor }) => {
                const { from, to } = editor.state.selection
                const isSelected = from === to && editor.state.selection.$from.parent === node
                return node.type.name === 'paragraph' && isSelected ? "어떤 내용을 작성할까요?" : ''
            },
            showOnlyCurrent: false,
        }),
    ];

    return extensions;
}