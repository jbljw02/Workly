'use client';

import formatTimeDiff from "@/utils/formatTimeDiff";
import MenuIcon from '../../../public/svgs/editor/menu-vertical.svg'
import ShareDocumentIcon from '../../../public/svgs/shared-document.svg'
import { useRouter } from "next/navigation";
import { DocumentProps, selectedDocument, toggleShortcut } from "@/redux/features/documentSlice";
import EmptyFolderIcon from '../../../public/svgs/empty-folder.svg';
import { MenuItemProps } from "../editor/child/MenuItem";
import useCopyDocument from "../hooks/useCopyDocument";
import { useCopyURL } from "../hooks/useCopyURL";
import { useRef, useState } from "react";
import MoveIcon from '../../../public/svgs/editor/move-folder.svg'
import CopyIcon from '../../../public/svgs/editor/copy.svg'
import DeleteIcon from '../../../public/svgs/trash.svg'
import LinkCopyIcon from '../../../public/svgs/editor/link.svg'
import useDeleteDocument from "../hooks/useDeleteDocument";
import MenuList from "../editor/child/MenuList";
import HoverTooltip from "../editor/child/menu-bar/HoverTooltip";
import { useClickOutside } from "../hooks/useClickOutside";
import LabelButton from "../button/LabelButton";
import ShareIcon from '../../../public/svgs/group.svg';
import DocumentMoveModal from "../modal/DocumentMoveModal";
import ShareDocumentModal from "../modal/share/ShareDocumentModal";
import ShortcutsOffIcon from '../../../public/svgs/shortcuts-off.svg';
import ShortcutsOnIcon from '../../../public/svgs/shortcuts-on.svg';
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { showWarningAlert } from "@/redux/features/alertSlice";
import DocumentListItem from "./DocumentListItem";
import React from "react";

type DocumentListProps = {
    documents: DocumentProps[];
    isShared?: boolean;
}

export default function DocumentList({ documents, isShared }: DocumentListProps) {
    return (
        <div className='flex flex-col w-full h-full'>
            {
                documents.length > 0 ?
                    (
                        documents.map(document => (
                            <React.Fragment key={document.id}>
                                <DocumentListItem
                                    document={document}
                                    isShared={isShared} />
                            </React.Fragment>
                        ))
                    ) :
                    (
                        <div className="flex items-center justify-center w-full h-full text-neutral-500 gap-4 mb-14">
                            <EmptyFolderIcon width="48" />
                            <div className="text-lg">아직 문서가 존재하지 않습니다.</div>
                        </div>
                    )
            }
        </div>
    )
}
