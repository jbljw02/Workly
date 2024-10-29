import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import SidebarItem from "../aside/child/SidebarItem";
import TrashIcon from '../../../public/svgs/trash.svg';
import CommonInput from "../input/CommonInput";
import CategoryButton from "../button/CategoryButton";
import TrashList from "./child/TrashList";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { setDocumentsTrash, setFoldersTrash } from "@/redux/features/trashSlice";
import { showWarningAlert } from "@/redux/features/alertSlice";

export type SearchCategory = '폴더' | '문서';

export default function Trash({ isCollapsed }: { isCollapsed: boolean }) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    const trashRef = useRef<HTMLDivElement>(null);

    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchCategory, setSearchCategory] = useState<SearchCategory>('문서');

    // 휴지통에 있는 문서들을 가져옴
    const getTrashDocuments = useCallback(async () => {
        if (user.email) {
            try {
                const response = await axios.get('/api/trash/document', {
                    params: { email: user.email }
                })
                dispatch(setDocumentsTrash(response.data));
            } catch (error) {
                dispatch(showWarningAlert('휴지통의 정보를 불러오는 데에 실패했습니다.'));
            }
        }
    }, [user.email]);

    // 휴지통에 있는 폴더들을 가져옴
    const getTrashFolders = useCallback(async () => {
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
    }, [user.email]);

    useEffect(() => {
        getTrashDocuments();
        getTrashFolders();
    }, [getTrashDocuments, getTrashFolders]);

    useClickOutside(trashRef, () => setIsTrashOpen(false));

    return (
        <div ref={trashRef}>
            {/* 휴지통 */}
            <SidebarItem
                Icon={TrashIcon}
                IconWidth="19"
                label="휴지통"
                isCollapsed={isCollapsed}
                onClick={() => setIsTrashOpen(!isTrashOpen)} />
            {/* 휴지통 내용 */}
            <div
                className={`flex flex-col absolute z-20 w-[380px] h-[450px] left-full bottom-6 -ml-10 py-4 gap-2 bg-white rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.25)] border border-neutral-200
                transition-opacity duration-200 ease-in-out
                ${isTrashOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-semibold px-4 ml-0.5">휴지통</div>
                <div className="px-4">
                    <CommonInput
                        style={{
                            px: 'px-2',
                            py: 'py-1',
                            textSize: 'text-[13px]',
                        }}
                        type="text"
                        value={inputValue}
                        setValue={setInputValue}
                        placeholder="삭제된 페이지 검색"
                        autoFocus={true} />
                </div>
                <div className="flex flex-row gap-2 mt-1 px-4">
                    <CategoryButton
                        label="문서"
                        activated={searchCategory === '문서'}
                        onClick={() => setSearchCategory('문서')} />
                    <CategoryButton
                        label="폴더"
                        activated={searchCategory === '폴더'}
                        onClick={() => setSearchCategory('폴더')} />
                </div>
                {/* 휴지통에 존재하는 폴더, 문서들의 목록 */}
                <TrashList searchCategory={searchCategory} />
            </div>
        </div>
    )
}