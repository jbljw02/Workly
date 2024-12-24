import { useEffect, useRef, useState } from "react";
import SidebarItem from "../aside/child/SidebarItem";
import TrashIcon from '../../../public/svgs/trash.svg';
import TrashContent from "./child/TrashContent";
import { showWarningAlert } from "@/redux/features/alertSlice";
import { setTrashLoading } from "@/redux/features/placeholderSlice";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trashSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";

export type SearchCategory = '폴더' | '문서';

export default function Trash({ isCollapsed }: { isCollapsed: boolean }) {
    const dispatch = useAppDispatch();
    
    const user = useAppSelector(state => state.user);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const [isTrashOpen, setIsTrashOpen] = useState(false);

    // 휴지통에 있는 문서들을 가져옴
    const getTrashDocuments = async () => {
        if (user.email) {
            try {
                dispatch(setTrashLoading(true));

                const response = await axios.get('/api/trash/document', {
                    params: { email: user.email }
                })
                dispatch(setDocumentsTrash(response.data));
            } catch (error) {
                dispatch(showWarningAlert('휴지통의 정보를 불러오는 데에 실패했습니다.'));
            } finally {
                dispatch(setTrashLoading(false));
            }
        }
    }

    // 휴지통에 있는 폴더들을 가져옴
    const getTrashFolders = async () => {
        if (user.email) {
            try {
                const response = await axios.get('/api/trash/folder', {
                    params: { email: user.email }
                })
                dispatch(setFoldersTrash(response.data));
            } catch (error) {
                dispatch(showWarningAlert('휴지통의 정보를 불러오는 데에 실패했습니다.'));
            }
        }
    }

    useEffect(() => {
        getTrashDocuments();
        getTrashFolders();
    }, [user.email]);

    return (
        <>
            <div ref={sidebarRef}>
                {/* 휴지통 토글 버튼 */}
                <SidebarItem
                    Icon={TrashIcon}
                    IconWidth="19"
                    label="휴지통"
                    isCollapsed={isCollapsed}
                    onClick={() => setIsTrashOpen(!isTrashOpen)} />
            </div>
            {/* 휴지통 내용 */}
            {
                isTrashOpen && (
                    <TrashContent
                        parentRef={sidebarRef}
                        setIsTrashOpen={setIsTrashOpen} />
                )
            }
        </>
    )
}