import DocumentIcon from '../../../../../public/svgs/document.svg';
import { useRef, useState } from "react";
import GroupHoverItem from "../GroupHoverItem";
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import { DocumentProps, renameDocuments, setDocuments } from "@/redux/features/documentSlice";
import EditInput from "./EditInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from 'axios';
import HoverTooltip from '@/components/editor/child/menu-bar/HoverTooltip';
import useDeleteDocument from '@/components/hooks/useDeleteDocument';

type DocumentItemProps = {
    document: DocumentProps;
    onClick?: () => void;
}

export default function DocumentItem({ document, onClick }: DocumentItemProps) {
    const dispatch = useAppDispatch();
    const deleteDoc = useDeleteDocument();

    const [isEditing, setIsEditing] = useState(false);
    const [docTitle, setDocTitle] = useState(document.title);

    // 문서명 수정
    const completeEdit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const prevDoc = document;

            try {
                dispatch(renameDocuments({ docId: document.id, newTitle: docTitle }));
                setIsEditing(false);

                await axios.put('/api/document',
                    {
                        docId: document.id,
                        newDocName: docTitle,
                    });
            } catch (error) {
                console.error(error);

                // 요청 실패 시 롤백
                setDocTitle(prevDoc.title);
                dispatch(renameDocuments({ docId: prevDoc.id, newTitle: prevDoc.title }));
            }
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }

    return (
        <div
            onClick={onClick}
            className="flex flex-row justify-between items-center pl-3 pr-1 w-full h-[30px] text-sm rounded cursor-pointer hover:bg-gray-100 group">
            {/* 아이콘과 문서명 */}
            <div className="flex flex-row gap-2 text-zinc-600 overflow-hidden">
                <div className="flex flex-shrink-0">
                    <DocumentIcon width="15" />
                </div>
                <div className="truncate select-none">
                    {
                        isEditing ?
                            <EditInput
                                title={docTitle}
                                setTitle={setDocTitle}
                                completeEdit={completeEdit}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing} /> :
                            document.title || '제목 없는 문서'
                    }
                </div>
            </div>
            {/* 문서에 적용할 수 있는 옵션들 */}
            <div className="flex flex-row items-center ml-1">
                <HoverTooltip label='문서명 수정'>
                    <GroupHoverItem
                        Icon={EditIcon}
                        IconWidth={15}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }} />
                </HoverTooltip>
                <HoverTooltip label='문서 삭제'>
                    <GroupHoverItem
                        Icon={DeleteIcon}
                        IconWidth={15}
                        onClick={(e) => deleteDoc(e, document)} />
                </HoverTooltip>
            </div>
        </div>
    )
}
