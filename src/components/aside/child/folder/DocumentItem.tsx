import { Folder } from "@/redux/features/folderSlice"
import DocumentIcon from '../../../../../public/svgs/document.svg';
import { useRef, useState } from "react";
import GroupHoverItem from "../GroupHoverItem";
import ArrowIcon from '../../../../../public/svgs/right-arrow.svg';
import EditIcon from '../../../../../public/svgs/editor/pencil-edit.svg';
import DeleteIcon from '../../../../../public/svgs/trash.svg';
import { deleteDocuments, DocumentProps, renameDocuments, setDocuments } from "@/redux/features/documentSlice";
import HoverTooltip from "@/components/editor/child/HoverTooltip";
import EditInput from "./EditInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getUserDocument from "@/components/hooks/getUserDocument";
import axios from 'axios';
import getUserFolder from "@/components/hooks/getUserFolder";

type DocumentItemProps = {
    document: DocumentProps;
}

export default function DocumentItem({ document }: DocumentItemProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const documents = useAppSelector(state => state.documents);

    const [isEditing, setIsEditing] = useState(false);
    const [docTitle, setDocTitle] = useState(document.title);

    const completeEdit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const prevDoc = document;

            dispatch(renameDocuments({ docId: document.id, newTitle: docTitle }));
            setIsEditing(false);

            try {
                await axios.put('/api/document',
                    {
                        email: user.email,
                        docId: document.id,
                        parentFolderName: document.folderName,
                        newDocName: docTitle
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });

                // 문서명이 수정됐으니 전체 배열 업데이트
                getUserDocument(user.email, dispatch);
                getUserFolder(user.email, dispatch);
            } catch (error) {
                console.error(error);

                setDocTitle(prevDoc.title);
                dispatch(renameDocuments({ docId: prevDoc.id, newTitle: prevDoc.title }));
            }
        }
        if (e.key === 'Escape') {
            setIsEditing(false);

        }
    }

    // 문서 삭제 요청
    const deleteDoc = async () => {
        const prevDocs = [...documents];

        dispatch(deleteDocuments(document.id));

        try {
            await axios.delete('/api/document', {
                params: {
                    email: user.email,
                    docId: document.id,
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
        } catch (error) {
            console.error(error);
            // 삭제에 실패하면 롤백
            dispatch(setDocuments(prevDocs));
        }
    }

    return (
        <div className="flex flex-row justify-between items-center pl-3 pr-1 w-full h-[30px] text-sm rounded cursor-pointer hover:bg-gray-100 group">
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
                        onClick={() => setIsEditing(true)} />
                </HoverTooltip>
                <HoverTooltip label='문서 삭제'>
                    <GroupHoverItem
                        Icon={DeleteIcon}
                        IconWidth={15}
                        onClick={deleteDoc} />
                </HoverTooltip>
            </div>
        </div>
    )
}