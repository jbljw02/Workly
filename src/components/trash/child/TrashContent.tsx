import CategoryButton from "@/components/button/CategoryButton";
import CommonInput from "@/components/input/CommonInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRef, useState, Dispatch, SetStateAction } from "react";
import TrashList from "./TrashList";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { setIsDeletingModalOpen, setTrashSearchCategory } from "@/redux/features/trash/trashSlice";
import DeleteCheckModal from "@/components/modal/DeleteCheckModal";

type TrashContentProps = {
    parentRef: React.RefObject<HTMLDivElement>;
    setIsTrashOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TrashContent({ parentRef, setIsTrashOpen }: TrashContentProps) {
    const dispatch = useAppDispatch();

    const trashRef = useRef<HTMLDivElement>(null);

    const isDeletingModalOpen = useAppSelector(state => state.isDeletingModalOpen);
    const trashSearchCategory = useAppSelector(state => state.trashSearchCategory);
    const [inputValue, setInputValue] = useState('');

    useClickOutside(trashRef, () => setIsTrashOpen(false), parentRef, isDeletingModalOpen);

    return (
        <div
            ref={trashRef}
            className='flex flex-col absolute z-20 w-[380px] h-[450px] left-full bottom-6 -ml-10 py-4 gap-2 bg-white rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.25)] border border-neutral-200'>
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
                    activated={trashSearchCategory === '문서'}
                    onClick={() => dispatch(setTrashSearchCategory('문서'))} />
                <CategoryButton
                    label="폴더"
                    activated={trashSearchCategory === '폴더'}
                    onClick={() => dispatch(setTrashSearchCategory('폴더'))} />
            </div>
            {/* 휴지통에 존재하는 폴더, 문서들의 목록 */}
            <TrashList
                searchedInput={inputValue} />
            {/* 삭제 확인 모달 */}
            <DeleteCheckModal
                isModalOpen={isDeletingModalOpen}
                setIsModalOpen={(value) => dispatch(setIsDeletingModalOpen(value))} />
        </div>
    )
}