import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Y from 'yjs'
import { TiptapCollabProvider } from "@hocuspocus/provider";
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
import FileHandler from '@tiptap-pro/extension-file-handler'
import ImageNodeView from '@/components/editor/child/image/ImageNodeView'
import { setLinkTooltip } from '@/redux/features/linkSlice'
import uploadImage from '@/utils/uploadImage'
import uploadFile from '@/utils/uploadFile'
import { FontSize } from "../../../lib/fontSize";
import { FontFamily } from "../../../lib/fontFamily";
import LinkNode from "../../../lib/linkNode";
import FileNode from "../../../lib/fileNode";
import { Editor } from "@tiptap/react";
import '@/styles/editor.css'
import axios from "axios";

const doc = new Y.Doc();
const appId = process.env.NEXT_PUBLIC_TIPTAP_APP_ID;
const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
// const room = `room.${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`
const colors = [
    '#958DF1',
    '#F98181',
    '#FBBC88',
    '#FAF594',
    '#70CFF8',
    '#94FADB',
    '#B9F18D',
    '#C3E2C2',
    '#EAECCC',
    '#AFC8AD',
    '#EEC759',
    '#9BB8CD',
    '#FF90BC',
    '#FFC0D9',
    '#DC8686',
    '#7ED7C1',
    '#F3EEEA',
    '#89B9AD',
    '#D0BFFF',
    '#FFF8C9',
    '#CBFFA9',
    '#9BABB8',
    '#E3F4F4',
]

export default function useEditorExtension({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());

    // 웹소켓 서버에 연결
    const provider = useMemo(() => new TiptapCollabProvider({
        name: docId,
        appId: appId!,
        document: doc,
        onConnect: () => {
                console.log('connected')
        }
    }), [])

    useEffect(() => {
        return () => {
            provider.destroy();
        };
    }, []);

    // 현재 사용자의 정보를 필드에 할당
    const setUserAwarness = useCallback(() => {
        provider.setAwarenessField('user', {
            name: user.displayName,
            color: '#ffcc00',
        });
    }, [provider, user.displayName]);

    useEffect(() => {
        provider.awareness?.on('change', setUserAwarness);

        return () => {
            provider.awareness?.off('change', setUserAwarness);
        };
    }, [setUserAwarness]);

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

                        if (file.type.startsWith('image/')) {
                            uploadImage(currentEditor, file, src)
                        } else {
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
        }),
        Collaboration.configure({
            document: doc,
        }),
        CollaborationCursor.configure({
            provider,
            user: {
                name: user.displayName,
                color: '#ffcc00',
            },
        }),
    ];

    return extensions;
}
