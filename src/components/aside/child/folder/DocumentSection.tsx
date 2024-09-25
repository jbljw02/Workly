import { Folder } from "@/redux/features/folderSlice"
import DocumentIcon from '../../../../../public/svgs/document.svg';
import DocumentItem from "./DocumentItem";

type DocumentSection = {
    folder: Folder,
}

export default function DocumentSection({ folder }: DocumentSection) {
    return (
        <div>
            {
                folder.documents.length ?
                    folder.documents.map(doc => {
                        return (
                            // 각각의 폴더 영역
                            <DocumentItem document={doc} />
                        )
                    }) :
                    // 폴더에 하위 문서가 없을 때
                    <div className="flex flex-row pl-3">
                        <div className="flex items-center gap-2 h-[30px] text-sm text-zinc-400">
                            <DocumentIcon width="15" />
                            <div>하위 문서 없음</div>
                        </div>
                    </div>
            }
        </div>
    )
}
