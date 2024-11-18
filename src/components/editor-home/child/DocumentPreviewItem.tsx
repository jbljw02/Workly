import PdfFileNode from "@/components/editor/child/file/PdfFileNode";
import { DocumentProps } from "@/redux/features/documentSlice"
import formatTimeDiff from "@/utils/formatTimeDiff";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import Link from 'next/link';
import GroupIcon from '../../../../public/svgs/group.svg';
import HoverTooltip from "@/components/editor/child/menu-bar/HoverTooltip";
import { useAppSelector } from "@/redux/hooks";
import ShortcutsOnIcon from '../../../../public/svgs/shortcuts-on.svg';

type DocumentPreviewItemProps = {
    document: DocumentProps;
}

export default function DocumentPreviewItem({ document }: DocumentPreviewItemProps) {
    const user = useAppSelector(state => state.user);
    const documents = useAppSelector(state => state.documents);

    // 문서 미리보기 렌더링
    const renderDocumentPreview = (docContent: JSONContent | null) => {
        return docContent?.content?.map((block, index) => {
            if (block.type === 'paragraph') {
                return <p key={index}>
                    {block.content?.map(item => item.text)}
                </p>;
            }
            // 순서 있는 목록 블록
            else if (block.type === 'orderedList') {
                return <p key={index}>
                    <ol className="-ml-1">
                        {
                            block.content?.map((item, i) => (
                                <li className="py-0.5" key={i}>
                                    {item.content?.[0]?.content?.[0]?.text || ''}
                                </li>
                            ))
                        }
                    </ol>
                </p>;
            }
            // 순서 없는 목록 블록
            else if (block.type === 'bulletList') {
                return <p key={index}>
                    <ul className="-ml-1">
                        {
                            block.content?.map((item, i) => (
                                <li className="py-0.5" key={i}>
                                    {item.content?.[0]?.content?.[0]?.text || ''}
                                </li>
                            ))
                        }
                    </ul>
                </p>;
            }
            // 헤딩 블록
            else if (block.type === 'heading') {
                if (block.attrs?.level === 1) {
                    return <p
                        key={index}
                        className="text-[19px] font-semibold my-1">
                        {block.content?.map(item => item.text)}
                    </p>
                }
                else if (block.attrs?.level === 2) {
                    return <p
                        key={index}
                        className="text-[18px] font-semibold my-1">
                        {block.content?.map(item => item.text)}
                    </p>
                }
                else if (block.attrs?.level === 3) {
                    return <p
                        key={index}
                        className="text-[17px] font-semibold my-1">
                        {block.content?.map(item => item.text)}
                    </p>
                }
            }
            // 파일 블록
            else if (block.type === 'file') {
                return <p key={index}>
                    <PdfFileNode fileTitle={block.attrs?.title} fileUrl={block.attrs?.src} />
                </p>;
            }
            // 코드 블록
            else if (block.type === 'codeBlock') {
                return <p key={index}>
                    <pre
                        className="w-full text-xs px-3 py-2 truncate my-0">
                        {block.content?.map(item => item.text).join(' ')}
                    </pre>
                </p>
            }
            // 이미지 블록
            else if (block.type === 'imageComponent') {
                return <p className="my-1" key={index}>
                    <Image
                        src={block.attrs?.src}
                        alt={block.attrs?.alt}
                        width={block.attrs?.width}
                        height={block.attrs?.height}
                        className="max-w-full h-auto"
                        style={{ objectFit: "contain" }} />
                </p>;
            }
            // 수평선 블록
            else if (block.type === 'horizontalRule') {
                return <p key={index}>
                    <hr className="my-1.5" />
                </p>;
            }
            // 인용굽 ㅡㄹ록
            else if (block.type === 'blockquote') {
                return (
                    <blockquote key={index} className="pl-3 border-l-3 border-gray-300 my-2">
                        {
                            block.content?.map((paragraph, i) => (
                                <p className="py-0.5" key={i}>
                                    {paragraph.content?.map(item => item.text).join(' ')}
                                </p>
                            ))
                        }
                    </blockquote>
                );
            }
            return null;
        });
    };

    return (
        <Link
            href={`/editor/${document.folderId}/${document.id}`}
            className="flex flex-col justify-between border p-4 rounded shadow-sm w-[254px] h-96 overflow-hidden
                cursor-pointer hover:bg-gray-100 transition-all duration-150">
            <div className="flex flex-col overflow-hidden">
                {/* 문서 제목 */}
                <div className="text-xl font-semibold py-0 pb-2">{document.title || "제목 없는 노트"}</div>
                {/* 문서 미리보기 */}
                <div className="text-sm text-neutral-500 overflow-hidden mb-3 [&>p]:py-[3px]">
                    {renderDocumentPreview(document.docContent)}
                </div>
            </div>
            <div className="flex flex-row justify-between text-neutral-600">
                {/* 마지막 편집 시간 */}
                <div className="text-xs mt-auto">
                    {formatTimeDiff(document.readedAt)}
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    {/* 문서에 협업자가 있을 경우 */}
                    {
                        document.collaborators.length > 0 &&
                        <GroupIcon width={13} />
                    }
                    {/* 즐겨찾기로 추가한 문서일 경우 */}
                    {
                        document.shortcutsUsers.includes(user.email) &&
                        <ShortcutsOnIcon width={16} />
                    }
                </div>
            </div>
        </Link>
    )
}
