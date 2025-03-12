import React, { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { v4 as uuidv4 } from 'uuid';
import DocumentItem from "@/components/aside/child/folder/DocumentItem";
import { Editor } from "@tiptap/react";
import { DocumentProps } from "@/types/document.type";

type LinkTargetDocumentListProps = {
    editor: Editor;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchedValue: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function LinkTargetDocumentList({ editor, setIsOpen, searchedValue }: LinkTargetDocumentListProps) {
    const documents = useAppSelector(state => state.documents);

    const filteredDocuments = useMemo(() => 
        documents.filter(document => document.title.includes(searchedValue)),
        [documents, searchedValue]
    );

    const addLinkDocumentUrl = (document: DocumentProps) => {
        const documentURL = `${baseURL}/editor/${document.folderId}/${document.id}`;
        const id = uuidv4();
        (editor.chain() as any).focus().extendMarkRange('link').setLink({
            href: documentURL,
            id,
            'document-name': document.title
        }).run();
        setIsOpen(false);
    }

    return (
        <div className="ml-1 mt-4 w-full text-[13px]">
            <div className="mb-1 w-full font-bold">문서 목록</div>
            <div className="w-full -ml-1">
                {
                    filteredDocuments.map(document => (
                        <React.Fragment key={document.id}>
                            <DocumentItem
                                document={document}
                                onClick={() => addLinkDocumentUrl(document)}
                                paddingLeft="pl-1" />
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    )
}