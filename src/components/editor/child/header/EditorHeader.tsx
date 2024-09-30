import PaperIcon from '../../../../../public/svgs/editor/paper.svg'
import MenuIcon from '../../../../../public/svgs/editor/menu-horizontal.svg'
import HoverTooltip from '../HoverTooltip'
import ToolbarButton from '../ToolbarButton'
import { useEffect, useRef, useState } from 'react'
import EditIcon from '../../../../../public/svgs/editor/edit.svg'
import LinkCopyIcon from '../../../../../public/svgs/editor/link.svg'
import DownloadIcon from '../../../../../public/svgs/editor/download.svg'
import CopyIcon from '../../../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../../../public/svgs/trash.svg'
import MoveIcon from '../../../../../public/svgs/editor/move-folder.svg'
import MenuList from '../MenuList'
import { MenuItemProps } from '../MenuItem'
import LockIcon from '../../../../../public/svgs/editor/lock.svg'
import formatTimeDiff from '@/utils/formatTimeDiff'
import html2pdf from 'html2pdf.js';
import { Editor } from '@tiptap/react'
import { useClickOutside } from '@/components/hooks/useClickOutside'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import HeaderTitle from './HeaderTitle'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfFileNode from '../file/PdfFileNode'
import ReactDOMServer from 'react-dom/server';
import AddInputModal from '@/components/modal/AddInputModal'
import { usePathname } from 'next/navigation'
import WarningAlert from '@/components/alert/WarningAlert'
import CompleteAlert from '@/components/alert/CompleteAlert'
import { addDocuments, deleteDocuments, DocumentProps } from '@/redux/features/documentSlice'
import { v4 as uuidv4 } from 'uuid';
import { addDocumentToFolder, Folder } from '@/redux/features/folderSlice'
import getUserDocument from '@/components/hooks/getUserDocument'
import getUserFolder from '@/components/hooks/getUserFolder'
import axios from 'axios'
import DocumentMoveModal from '@/components/modal/DocumentMoveModal'

type EditorHeaderProps = {
    editor: Editor,
    docTitle: string,
    lastUpdatedTime: string;
    setLastUpdatedTime: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditorHeader({
    editor,
    docTitle,
    lastUpdatedTime,
    setLastUpdatedTime }: EditorHeaderProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const folders = useAppSelector(state => state.folders);

    // 문서가 소속된 폴더를 찾음
    const parentFolder = folders.find(folder => folder.name === selectedDocument.folderName);

    const [menuListOpen, setMenuListOpen] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [isDocCopied, setIsDocCopied] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    const [isFailedInfo, setIsFailedInfo] = useState({
        isFailed: false,
        msg: '',
    });

    // 링크 복사
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL);
        setIsLinkCopied(true);
    }

    // 에디터 내용을 PDF로 변환하고 다운로드하는 함수
    const downloadPDF = async () => {
        try {
            // 에디터의 HTML 콘텐츠 가져오기
            let content = editor.getHTML();

            // 에디터에서 가져온 HTML을 임시 div에 파싱
            const container = document.createElement('div');
            container.innerHTML = content;

            // 모든 파일 노드를 찾음
            const fileNodes = container.querySelectorAll('[data-file]');

            fileNodes.forEach((node) => {
                // 파일명을 가져오고, 링크를 생성할 URL을 가져옴
                const filename = node.getAttribute('title') || '알 수 없는 파일';
                const fileUrl = node.getAttribute('href') || ''; // 파일의 URL을 가져옴 (미리 업로드되어 있다고 가정)

                // 컴포넌트를 HTML로 변환
                const pdfFileNodeHtml = ReactDOMServer.renderToString(
                    <PdfFileNode fileTitle={filename} fileUrl={fileUrl} />
                );

                // 파일 노드를 새로운 HTML로 교체
                const replacementNode = document.createElement('div');
                replacementNode.innerHTML = pdfFileNodeHtml;

                // 기존 파일 노드를 새로운 노드로 교체
                node.parentNode?.replaceChild(replacementNode, node);
            });

            // 변경된 HTML 콘텐츠를 문자열로 변환
            content = container.innerHTML;

            const response = await fetch('/api/export-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content, // 변경된 HTML 콘텐츠
                    title: docTitle || '제목 없는 문서',
                }),
            });

            if (!response.ok) {
                throw new Error('PDF 생성에 실패했습니다.');
            }

            // blod = Binary Large Obejct
            // 파일, 이미지, 비디오 등을 이진 형식으로 저장하고 조작할 수 있도록 도와줌
            const pdfBlob = await response.blob();

            // PDF 다운로드를 위한 링크 생성
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${docTitle || '제목 없는 문서'}.pdf`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('PDF 다운로드 중 오류 발생:', error);
        }
    };

    // 문서의 사본을 생성
    const copyDoc = async (doc: DocumentProps) => {
        const copiedDocument: DocumentProps = {
            ...doc,
            id: uuidv4(), // 사본이지만 ID는 중복되면 안 되기에 새로 생성
        }

        if (parentFolder) {
            try {
                // 전체 문서 배열에 추가
                dispatch(addDocuments(copiedDocument));
                // 문서 ID를 폴더에 추가
                dispatch(addDocumentToFolder({ folderId: parentFolder.id, document: copiedDocument.id }));

                await axios.post('/api/document',
                    { email: user.email, folderId: parentFolder.id, document: copiedDocument },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });

                setIsDocCopied(true);
                // 문서를 추가했으니 전체 배열 업데이트
                getUserDocument(user.email, dispatch);
                getUserFolder(user.email, dispatch);
            } catch (error) {
                console.error(error);
                dispatch(deleteDocuments(copiedDocument.id)); // 문서 복사 실패 시 롤백
                setIsFailedInfo({
                    isFailed: true,
                    msg: `${selectedDocument.title}의 사본 생성에 실패했습니다.`,
                })
            }
        }
    }

    const menuItems: MenuItemProps[] = [
        {
            Icon: MoveIcon,
            IconWidth: "15",
            label: "옮기기",
            onClick: () => setIsMoving(true),
        },
        {
            Icon: CopyIcon,
            IconWidth: "16",
            label: "사본 만들기",
            onClick: () => copyDoc(selectedDocument),
        },
        {
            Icon: LinkCopyIcon,
            IconWidth: "16",
            label: "링크 복사",
            onClick: () => copyURL(),
        },
        {
            Icon: DownloadIcon,
            IconWidth: "14",
            label: "다운로드",
            onClick: () => downloadPDF(),
        },
        {
            Icon: DeleteIcon,
            IconWidth: "17",
            label: "휴지통으로 이동",
            onClick: () => console.log("A"),
            horizonLine: true,
        }
    ];

    useEffect(() => {
        // 1분마다 문서의 마지막 편집 시간이 언제인지 확인
        const updatedTimeInterval = setInterval(() => {
            const updatedTime = formatTimeDiff(selectedDocument.updatedAt);
            setLastUpdatedTime(updatedTime);
        }, 60000);

        return () => clearInterval(updatedTimeInterval);
    }, [selectedDocument.updatedAt]);

    const optionRef = useRef<HTMLDivElement>(null);

    useClickOutside(optionRef, () => setMenuListOpen(false), optionRef);

    return (
        <div className='flex flex-row justify-between pl-3 pr-5 py-3'>
            {/* 헤더 좌측 영역 */}
            <HeaderTitle />
            {/* 헤더 우측 영역 */}
            <div className='flex flex-row items-center gap-1'>
                <div className='text-sm text-neutral-400 mr-1'>{lastUpdatedTime}</div>
                <HoverTooltip label='문서를 공유하거나 게시'>
                    <button className='text-sm px-1.5 py-1 rounded-sm hover:bg-gray-100 cursor-pointer'>공유</button>
                </HoverTooltip>
                <HoverTooltip label="나에게만 공개">
                    <ToolbarButton
                        Icon={LockIcon}
                        iconWidth={20} />
                </HoverTooltip>
                <div
                    onClick={() => setMenuListOpen(!menuListOpen)}
                    ref={optionRef}>
                    <HoverTooltip label="옵션">
                        <ToolbarButton
                            Icon={MenuIcon}
                            iconWidth={25}
                            onClick={() => setMenuListOpen(true)} />
                    </HoverTooltip>
                    {
                        menuListOpen &&
                        <MenuList
                            menuList={menuItems}
                            setListOpen={setMenuListOpen}
                            listPositon={{ top: '46px', right: '18px' }} />
                    }
                </div>
            </div>
            {/* 링크 복사가 완료됐음을 알리는 alert */}
            <CompleteAlert
                isModalOpen={isLinkCopied}
                setIsModalOpen={setIsLinkCopied}
                label="링크가 복사되었습니다" />
            {/* 문서의 복제가 완료됐음을 알리는 alert */}
            <CompleteAlert
                isModalOpen={isDocCopied}
                setIsModalOpen={setIsDocCopied}
                label={`${parentFolder?.name}에 ${selectedDocument.title} 사본이 생성되었습니다.`} />
            {/* 작업이 실패했을 때 알릴 alert */}
            <WarningAlert
                isModalOpen={isFailedInfo.isFailed}
                setIsModalOpen={() => setIsFailedInfo((prevState) => ({
                    ...prevState,
                    isFailed: true,
                }))}
                label={isFailedInfo.msg} />
            <DocumentMoveModal
                isModalOpen={isMoving}
                setIsModalOpen={setIsMoving} />
        </div>
    )
}