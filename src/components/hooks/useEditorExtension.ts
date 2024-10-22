import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo, useState } from "react";
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

const ydoc = new Y.Doc()

export default function useEditorExtension({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    console.log("connectedUsers: ", connectedUsers)

    const provider = useMemo(() => new TiptapCollabProvider({
        appId: 'rm8veqko',
        name: docId,
        token: '',
        document: ydoc,
        baseUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        onOpen() {
            console.log('WebSocket 연결 열림')
        },
        onConnect() {
            console.log('서버에 연결됨')
        },
        onDisconnect(data) {
            console.log('서버 연결이 끊김', data)
        },
        onClose(data) {
            console.log('프로바이더가 닫힘', data)
        },
        onAwarenessUpdate(data) {
            console.log('현재 접속 중인 사용자:', Array.from(provider?.awareness?.getStates().values() || []));
            setConnectedUsers(Array.from(provider?.awareness?.getStates().values() || []).map(user => user.user?.name || '알 수 없음'));
        },
    }), [docId]);

    useEffect(() => {
        if (user.displayName && provider.awareness) {
            console.log("유저: ", user.displayName)
            provider.awareness.setLocalStateField('user', {
                name: user.displayName,
                color: '#f783ac',
            });
        }
    }, [user, provider]);

    // provider.on('awarenessChange', ({ states }) => {
    //     console.log("states: ", Array.from(states.entries()))
    // })

    const extensions = useMemo(() => [
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
            document: ydoc,
        }),
        CollaborationCursor.configure({
            provider,
            user: {
                name: user.displayName,
                color: '#f783ac',
            },
        }),
    ], [dispatch, user, provider]);

    return extensions;
}
