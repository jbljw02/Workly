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
import { setLinkTooltip } from '@/redux/features/linkSlice'
import { FontSize } from "../../../lib/fontSize";
import { FontFamily } from "../../../lib/fontFamily";
import LinkNode from "../../../lib/linkNode";
import FileNode from "../../../lib/fileNode";
import '@/styles/editor.css'
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";

export default function usePublishedExtension() {
    const dispatch = useAppDispatch();

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
        LinkNode.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            setLinkTooltip: (payload: any) => dispatch(setLinkTooltip(payload)),
        }),
        Dropcursor,
        ImageNodeView.configure({
            defaultWidth: 600,
            defaultHeight: 600,
        }),
        FileNode,
        Placeholder.configure({
            placeholder: ({ node, editor }) => {
                const { from, to } = editor.state.selection
                const isSelected = from === to && editor.state.selection.$from.parent === node
                return node.type.name === 'paragraph' && isSelected ? "명령어를 사용하려면 '/' 키를 누르세요." : ''
            },
            showOnlyCurrent: false,
        }),
    ];

    return extensions;
}
