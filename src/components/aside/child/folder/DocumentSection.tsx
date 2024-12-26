import { Folder } from "@/redux/features/folderSlice"
import DocumentIcon from '../../../../../public/svgs/document.svg';
import DocumentItem from "./DocumentItem";
import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";
import { useRouter } from "next-nprogress-bar";
import React from "react";

type DocumentSectionProps = {
    folder: Folder,
}

export default function DocumentSection({ folder }: DocumentSectionProps) {
    const router = useRouter();
    const documents = useAppSelector(state => state.documents);

    // 전체 문서에서 폴더가 가지고 있는 docId와 일치하는 것들만 필터링
    const documentsInFolder = useMemo(() =>
        documents.filter(doc => folder.documentIds.includes(doc.id)),
        [documents, folder]);

    return (
        <div>
            {
                documentsInFolder.length ?
                    documentsInFolder.map(doc => {
                        return (
                            // 각각의 폴더 영역
                            <React.Fragment key={doc.id}>
                                <DocumentItem
                                    document={doc}
                                    onClick={() => router.push(`/editor/${folder.id}/${doc.id}`)}
                                    paddingLeft="pl-3" />
                            </React.Fragment>

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
