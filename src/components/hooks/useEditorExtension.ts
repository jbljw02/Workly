import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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

const appId = process.env.NEXT_PUBLIC_TIPTAP_APP_ID;
const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const colors = [
    '#958DF1', // 보라색
    '#F98181', // 빨간색
    '#FBBC88', // 주황색
    '#FAF594', // 노란색
    '#70CFF8', // 하늘색
    '#94FADB', // 민트색
    '#B9F18D', // 연두색
    '#C3E2C2', // 연한 녹색
    '#EAECCC', // 연한 노란색
    '#AFC8AD', // 연한 녹색
    '#EEC759', // 금색
    '#9BB8CD', // 연한 파란색
    '#FF90BC', // 분홍색
    '#FFC0D9', // 연한 분홍색
    '#DC8686', // 갈색
    '#7ED7C1', // 청록색
    '#F3EEEA', // 연한 회색
    '#89B9AD', // 연한 청록색
    '#D0BFFF', // 연한 보라색
    '#FFF8C9', // 연한 노란색
    '#CBFFA9', // 연한 연두색
    '#9BABB8', // 연한 회색
    '#E3F4F4', // 연한 청록색
]

// docId를 키로 가지는 Y.Doc 인스턴스를 저장하는 맵
const docMap = new Map<string, Y.Doc>();

export default function useEditorExtension({ docId }: { docId: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    // docId에 해당하는 Y.Doc 인스턴스를 가져오거나 새로 생성
    const doc = useMemo(() => {
        if (!docMap.has(docId)) {
            docMap.set(docId, new Y.Doc());
        }
        return docMap.get(docId)!;
    }, [docId]);

    // 웹소켓 서버에 연결
    const provider = useMemo(() => new TiptapCollabProvider({
        name: docId,
        appId: appId!,
        document: doc,
        onConnect: () => {
            console.log('connected')
        },
    }), [docId, doc])

    useEffect(() => {
        return () => {
            provider.destroy();
        };
    }, [docId, doc]);

    // 사용자의 커서 색상을 지정
    const userColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

    // 현재 사용자의 정보를 필드에 할당
    useEffect(() => {
        provider.setAwarenessField('user', {
            name: user.displayName,
            color: userColor,
        });
    }, [user.displayName, userColor, provider]);

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
            },
        }),
    ];

    return extensions;
}
