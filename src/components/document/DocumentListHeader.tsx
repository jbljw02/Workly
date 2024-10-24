import IconButton from "../button/IconButton";
import SortIcon from '../../../public/svgs/sort.svg'

export default function DocumentListHeader() {
    return (
        <div className="flex flex-row w-full px-12" >
            <div className="flex-1 border-b text-left">
                <div className='inline-block px-1 pb-2 border-b-2 border-black font-semibold relative'>
                    제목
                    <div className="absolute bottom-0 left-0 w-full h-0.1 bg-black" />
                </div>
            </div>
            <div className="border-b text-left">
                <div className="flex justify-end">
                    <IconButton
                        icon={<SortIcon width="23" />}
                        hover="hover:bg-gray-100"
                        onClick={() => console.log('정렬 버튼')} />
                </div>
            </div>
        </div>
    )
}