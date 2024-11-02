import PdfFileNode from "@/components/editor/child/file/PdfFileNode";
import { DocumentProps } from "@/redux/features/documentSlice"
import formatTimeDiff from "@/utils/formatTimeDiff";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type DocumentPreviewItemProps = {
    key: string;
    document: DocumentProps;
}

export default function DocumentPreviewItem({ key, document }: DocumentPreviewItemProps) {
    const router = useRouter();
    
    // 문서 미리보기 렌더링
    const renderDocumentPreview = (docContent: JSONContent | null) => {
        return docContent?.content?.map((block, index) => {
            // 텍스트 블록
            if (block.type === 'paragraph') {
                return <p key={index}>{block.content?.map(item => item.text)}</p>;
            }
            // 파일 블록
            else if (block.type === 'file') {
                return <p key={index}><PdfFileNode fileTitle={block.attrs?.title} fileUrl={block.attrs?.src} /></p>;
            }
            // 코드 블록
            else if (block.type === 'codeBlock') {
                return <pre
                    className="w-full text-xs px-3 py-2 truncate my-3"
                    key={index}>{block.content?.map(item => item.text).join(' ')}</pre>;
            }
            // 이미지 블록
            else if (block.type === 'imageComponent') {
                return <Image
                    key={index}
                    src={block.attrs?.src}
                    alt={block.attrs?.alt}
                    width={block.attrs?.width}
                    height={block.attrs?.height}
                    className="max-w-full h-auto"
                    style={{ objectFit: "contain" }} />;
            }
            return null;
        });
    };

    return (
        <div
            onClick={() => router.push(`/editor/${document.folderId}/${document.id}`)}
            className="flex flex-col justify-between border p-4 rounded shadow-sm w-64 h-96 overflow-hidden
                cursor-pointer hover:bg-gray-100 transition-all duration-150">
            <div className="flex flex-col overflow-hidden">
                {/* 문서 제목 */}
                <div className="text-xl font-semibold py-0 pb-2">{document.title || "제목 없는 노트"}</div>
                {/* 문서 미리보기 */}
                <div className="text-sm text-neutral-500 overflow-hidden mb-3">
                    {renderDocumentPreview(document.docContent)}
                </div>
            </div>
            {/* 마지막 편집 시간 */}
            <div className="text-xs text-neutral-600 mt-auto">
                {formatTimeDiff(document.readedAt)}
            </div>
        </div>
    )
}
