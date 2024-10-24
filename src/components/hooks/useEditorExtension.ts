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

export default function useEditorExtension({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [token, setToken] = useState<string>('');

    const tiptapCollabCheck = async () => {
        try {
            // Tiptap JWT 토큰 가져오기
            if (user.email && selectedDocument.author && selectedDocument.id) {
                const response = await axios.get('/api/auth/getCollabToken', {
                    params: {
                        userEmail: user.email,
                        authorEmail: selectedDocument.author.email,
                        docId: selectedDocument.id
                    }
                });

                console.log("response", response.data)

                const { tiptapToken } = response.data as { tiptapToken: string };

                setToken(tiptapToken);
                // console.log("토큰: ", tiptapToken);

            }
        } catch (error) {
            console.error('Tiptap 초기화 오류:', error);
        }
    }

    // 에디터 초기 마운트 시에 JWT 발급 및 접근 권한 여부 확인
    useEffect(() => {
        tiptapCollabCheck();
    }, [selectedDocument.id, selectedDocument.author, user.email, docId]);

    const provider = useMemo(() => new TiptapCollabProvider({
        appId: appId,
        name: docId,
        document: doc,
        token: token,
        baseUrl: wsUrl!,
        // onOpen() {
        //     console.log('WebSocket 연결 열림')
        // },
        // onConnect() {
        //     console.log('서버에 연결됨')
        // },
        // onDisconnect(data) {
        //     console.log('서버 연결이 끊김', data)
        // },
        // onClose(data) {
        //     console.log('프로바이더가 닫힘', data)
        // },
        // onMessage(data) {
        // console.log('메시지 수신', data)
        // },
        // onAwarenessUpdate({ states }) {
        // const connectedUsers = Array.from(states.values())
        //     .map(state => {
        //         // console.log("state", state)
        //         return state.user?.name || '알 수 없음'
        //     })
        // setConnectedUsers(connectedUsers);
        // },
    }), [docId, token]);

    // provider.on('awarenessChange', ({ states }: { states: any }) => {
    //     console.log("awarenessChange", states)
    // })

    // provider.on('authenticationFailed', ({ reason }: { reason: any }) => {
    //     console.error('Authentication failed:', reason)
    // })
    // provider.on('authenticated', () => {
    //     console.log('Authentication successful:')
    // })
    // provider.on('synced', () => {
    //     console.log('Document synced.')
    // })
    // provider.on('open', () => {
    //     console.log('메시지 전송',)
    // })

    // provider.on('synced', () => {
    //     console.log('Document synced.')
    // })

    // provider.on('outgoingMessage', (message: any) => {
    //     console.log('메시지 전송', user.displayName, message)
    // })
    // provider.on('message', (message: any) => {
    //     console.log('메시지 수신', user.displayName, message)
    // })


    // useEffect(() => {
    //     if (user.displayName && provider.awareness) {
    //         provider.setAwarenessField('user', {
    //             name: user.displayName,
    //             color: '#' + Math.floor(Math.random() * 16777215).toString(16), // 랜덤 색상
    //         })
    //     }
    // }, [user.displayName, provider]);

    // document.addEventListener('mousemove', (event) => {
    //     // Share any information you like
    //     provider.setAwarenessField('user', {
    //         name: user.displayName,
    //         color: '#ffcc00',
    //         mouseX: event.clientX,
    //         mouseY: event.clientY,
    //     })
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
            provider: provider,
            user: {
                name: user.displayName,
                color: '#ffcc00',
            },
        }),
    ], [dispatch, user]);

    return extensions;
}
