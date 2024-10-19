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
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { FontSize } from './fontSize'
import { FontFamily } from './fontFamily'
import FileNode from './fileNode'
import LinkNode from './linkNode'
import FileHandler from '@tiptap-pro/extension-file-handler'
import { v4 as uuidv4 } from 'uuid'
import { Editor, Extension } from '@tiptap/react'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { setLinkTooltip } from '@/redux/features/linkSlice'
import ImageNodeView from '@/components/editor/child/image/ImageNodeView'
import { UserProps } from '@/redux/features/userSlice'
import { AppDispatch } from '@/redux/store'
import { SetResizableImageProps } from './ImageNode'
import uploadImageToStorage from '@/utils/image/uploadImageToStorage'
import uploadImage from '@/utils/uploadImage'
import uploadFile from '@/utils/uploadFile'

const doc = new Y.Doc()
const room = `room.${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`
const appId = process.env.NEXT_PUBLIC_TIPTAP_APP_ID;

const provider = new TiptapCollabProvider({
    appId: appId!,
    name: room,
    document: doc,
})

const editorExtensions = (dispatch: AppDispatch, user: UserProps) => [
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
    FontSize,
    FontFamily,
    LinkNode.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        setLinkTooltip: (payload: any) => dispatch(setLinkTooltip(payload))
    }),
    Dropcursor,
    ImageNodeView.configure({
        defaultWidth: 600,
        defaultHeight: 600,
    }),
    FileNode,
    FileHandler.configure({
        onDrop: (currentEditor: Editor, files: File[], pos: number) => {
            files.forEach(file => {
                const fileReader = new FileReader()
                fileReader.onload = async () => {
                    const src = fileReader.result as string
                    const blobUrl = URL.createObjectURL(file);

                    // 이미지 파일일 경우
                    if (file.type.startsWith('image/')) {
                        uploadImage(currentEditor, file, src)
                    }
                    // 이미지가 아닌 일반 파일일 경우
                    else {
                        uploadFile(currentEditor, file, blobUrl, pos)
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
            return node.type.name === 'paragraph' && isSelected ? "명령어를 사용하려면 '/' 키를 누르세요." : ''
        },
        showOnlyCurrent: false,
    }) as Extension,
    Collaboration.configure({
        document: doc
    }),
    CollaborationCursor.configure({
        provider,
        user: {
            name: user.displayName,
            color: '#f783ac',
        },
    }),
]

export default editorExtensions;
