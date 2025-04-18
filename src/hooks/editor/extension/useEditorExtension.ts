import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo } from "react";
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
import { LinkTooltip, setLinkTooltip } from '@/redux/features/editor/linkSlice'
import { FontSize } from "../../../lib/fontSize";
import { FontFamily } from "../../../lib/fontFamily";
import LinkNode from "../../../lib/linkNode";
import FileNode from "../../../lib/fileNode";
import { Editor } from "@tiptap/react";
import '@/styles/editor.css'
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import CustomTextMark from "../../../lib/textMark";
import { setConnectedUsers, setConnection, setDocSynced } from "@/redux/features/editor/connectionSlice";
import DragHandle from '@tiptap-pro/extension-drag-handle'
import { EnsureLastParagraph } from "../../../lib/ensureLastParagraph";
import { ConnectedUser } from "@/types/user.type";
import useUploadImage from "../useUploadImage";
import useUploadFile from "../useUploadFile";

const appId = process.env.NEXT_PUBLIC_TIPTAP_APP_ID;

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

type useEditorExtensionProps = {
    docId: string,
}

export default function useEditorExtension({ docId }: useEditorExtensionProps) {
    const dispatch = useAppDispatch();

    const uploadNewImage = useUploadImage(docId);
    const uploadNewFile = useUploadFile(docId);

    const user = useAppSelector(state => state.user);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    // 사용자의 커서 색상을 지정
    const userColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

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
        onConnect: () => dispatch(setConnection(true)),
        onDisconnect: (error) => {
            dispatch(setConnection(false));
            dispatch(setDocSynced(false));

            // 연결이 끊어진 후 3초 후에 재연결 시도
            setTimeout(() => {
                if (provider) {
                    provider.connect();
                }
            }, 3000);
        },
        onSynced: () => dispatch(setDocSynced(true)),
    }), [docId, doc]);

    // 접속자 목록 업데이트
    useEffect(() => {
        const updateActiveUsers = () => {
            const users: ConnectedUser[] = [];
            provider.awareness?.getStates().forEach((state: any) => {
                const user = state.user;
                // 이미 연결된 사용자가 아니라면 접속자 목록에 추가
                if (user && !users.some(u => u.id === user.id)) {
                    users.push({
                        name: user.name,
                        id: user.id,
                        color: user.color,
                        photoURL: user.photoURL,
                        connectedAt: user.connectedAt,
                    });
                }
            });

            // 작성자를 제외한 사용자들을 접속 시간순으로 정렬
            const sortedUsers = users.sort((a, b) => {
                if (a.id === selectedDocument.author.email) return -1; // a가 작성자인 경우 제일 앞에 위치(a를 b보다 앞에 배치)
                if (b.id === selectedDocument.author.email) return 1; // b가 작성자인 경우 제일 뒤에 위치(b를 a보다 앞에 배치)
                return a.connectedAt - b.connectedAt; // 접속 시간순으로 정렬
            });

            dispatch(setConnectedUsers(sortedUsers));
        };

        // awareness 상태가 변경될 때마다 접속자 목록 업데이트
        provider.awareness?.on('change', updateActiveUsers);

        // 초기 상태 설정
        updateActiveUsers();

        return () => {
            provider.awareness?.off('change', updateActiveUsers);
        };
    }, [provider, dispatch, user, userColor, selectedDocument.author.email]);

    // 현재 사용자의 정보를 필드에 할당
    useEffect(() => {
        const setUserAwareness = () => {
            if (user.displayName && user.email && user.photoURL) {
                provider.setAwarenessField('user', {
                    name: user.displayName,
                    id: user.email,
                    color: userColor,
                    photoURL: user.photoURL,
                    connectedAt: Date.now(),
                });
            }
        };

        setUserAwareness();
    }, [user.displayName, user.email, user.photoURL, userColor, provider]);

    // 소켓 연결 해제
    useEffect(() => {
        return () => {
            if (provider) {
                provider.destroy();
            }
        };
    }, [provider]);

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
        Collaboration.configure({
            document: doc,
        }),
        CollaborationCursor.configure({
            provider: provider,
            user: {
                id: user.email,
                name: user.displayName,
                color: userColor,
                photoURL: user.photoURL,
                connectedAt: Date.now(),
            },
        }),
    ];

    return extensions;
}