import { useMemo } from 'react';
import { DocumentProps } from '@/types/document.type';
import MoveIcon from '../../../public/svgs/editor/move-folder.svg';
import CopyIcon from '../../../public/svgs/editor/copy.svg';
import DeleteIcon from '../../../public/svgs/trash.svg';
import LinkCopyIcon from '../../../public/svgs/editor/link.svg';
import DownloadIcon from '../../../public/svgs/editor/download.svg';
import WebIcon from '../../../public/svgs/web.svg';
import useCheckDemo from '../demo/useCheckDemo';

interface UseDocumentMenuProps {
    document: DocumentProps | null;
    editorPermission: string;
    isWebPublished?: boolean;
    onMove: () => void;
    onCopy: (doc: DocumentProps) => void;
    onCopyURL: (folderId: string, docId: string) => void;
    onDownload: () => void;
    onDelete: (e: React.MouseEvent, doc: DocumentProps) => void;
    onPublish: (doc: DocumentProps) => void;
    onCancelPublish: (docId: string) => void;
}

export default function useDocumentMenu({
    document,
    editorPermission,
    isWebPublished = false,
    onMove,
    onCopy,
    onCopyURL,
    onDownload,
    onDelete,
    onPublish,
    onCancelPublish
}: UseDocumentMenuProps) {
    const checkDemo = useCheckDemo();
    
    const menuItems = useMemo(() => {
        if (!document) return [];

        // 모든 권한에 공통적으로 들어가는 아이템
        const commonMenuItems = [
            {
                Icon: LinkCopyIcon,
                IconWidth: "16",
                label: "링크 복사",
                onClick: () => onCopyURL(document.folderId, document.id),
                disabled: checkDemo(),
            },
            {
                Icon: DownloadIcon,
                IconWidth: "14",
                label: "다운로드",
                onClick: onDownload,
                disabled: checkDemo(),
            }
        ];

        // 모든 권한을 가지고 있을 때의 아이템
        const fullPermissionItems = [
            {
                Icon: MoveIcon,
                IconWidth: "15",
                label: "옮기기",
                onClick: onMove,
            },
            {
                Icon: CopyIcon,
                IconWidth: "16",
                label: "사본 만들기",
                onClick: () => onCopy(document),
            },
            ...commonMenuItems
        ];

        // 웹 페이지로 게시된 문서를 보고 있다면
        if (isWebPublished) {
            return commonMenuItems;
        }

        // 모든 권한을 가지고 있지 않다면
        if (editorPermission !== '전체 허용') {
            return commonMenuItems;
        }

        // 게시가 완료된 문서
        if (document.isPublished) {
            return [
                ...fullPermissionItems,
                {
                    Icon: WebIcon,
                    IconWidth: "14",
                    label: "게시 취소",
                    onClick: () => onCancelPublish(document.id),
                    horizonLine: true,
                },
                {
                    Icon: DeleteIcon,
                    IconWidth: "17",
                    label: "휴지통으로 이동",
                    onClick: (e: React.MouseEvent) => onDelete(e, document),
                }
            ];
        }
        // 게시가 완료되지 않은 문서
        else {
            return [
                ...fullPermissionItems,
                {
                    Icon: WebIcon,
                    IconWidth: "14",
                    label: "게시",
                    onClick: () => onPublish(document),
                    horizonLine: true,
                    disabled: checkDemo(),
                },
                {
                    Icon: DeleteIcon,
                    IconWidth: "17",
                    label: "휴지통으로 이동",
                    onClick: (e: React.MouseEvent) => onDelete(e, document),
                }
            ];
        }
    }, [document, editorPermission, isWebPublished, checkDemo]);

    return menuItems;
}