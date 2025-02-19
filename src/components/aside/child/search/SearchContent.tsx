import CommonInput from "@/components/input/CommonInput";
import { Dispatch, SetStateAction, useState } from "react";
import SearchedDocumentList from "./SearchedDocumentList";

type SearchContentProps = {
    setIsSearching: Dispatch<SetStateAction<boolean>>;
}

export default function SearchContent({ setIsSearching }: SearchContentProps) {
    const [searchedInput, setSearchedInput] = useState('');
    return (
        <div className='flex flex-col absolute z-20 w-[380px] h-[450px] top-full mt-3 -ml-2 py-4 gap-2 bg-white rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.25)] border border-neutral-200'>
            <div className='font-semibold px-4 ml-0.5'>문서 검색</div>
            <div className='px-4'>
                <CommonInput
                    style={{
                        px: 'px-2',
                        py: 'py-1',
                        textSize: 'text-[13px]',
                    }}
                    type="text"
                    value={searchedInput}
                    setValue={setSearchedInput}
                    placeholder='문서명 검색'
                    autoFocus={true} />
            </div>
            {/* 검색 결과 목록 */}
            <SearchedDocumentList
                setIsSearching={setIsSearching}
                searchedInput={searchedInput} />
        </div>
    )
}