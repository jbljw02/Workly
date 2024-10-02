import { Folder } from "@/redux/features/folderSlice"
import DocumentIcon from '../../../../../public/svgs/document.svg';
import DocumentItem from "./DocumentItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getUserDocument from "@/components/hooks/getUserDocument";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/dist/client/components/navigation";

type DocumentSectionProps = {
    folder: Folder,
}

export default function DocumentSection({ folder }: DocumentSectionProps) {
    const router = useRouter();

    const documents = useAppSelector(state => state.documents);

    // 전체 문서에서 폴더가 가지고 있는 docId와 일치하는 것들만 필터링
    const documentsInFolder = useMemo(() =>
        documents.filter(doc => folder.documentIds?.includes(doc.id)),
        [documents, folder]);

    // 선택된 문서의 경로로 라우팅
    const docRouting = (folderId: string, docId: string) => {
        router.push(`/editor/${folderId}/${docId}`)
    }

    return (
        <div>
            {
                documentsInFolder.length ?
                    documentsInFolder.map(doc => {
                        return (
                            // 각각의 폴더 영역
                            <DocumentItem
                                onClick={() => docRouting(folder.id, doc.id)}
                                document={doc} />
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
