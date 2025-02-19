import { JSONContent } from "@tiptap/react";
import { UserProps } from "@/types/user.type";

export interface Collaborator extends UserProps {
    authority: '읽기 허용' | '쓰기 허용' | '전체 허용' | '관리자';
}

export type DocumentProps = {
    id: string;
    title: string;
    docContent: JSONContent | null;
    createdAt: { seconds: number, nanoseconds: number };
    readedAt: { seconds: number, nanoseconds: number };
    author: UserProps;
    folderId: string;
    folderName: string;
    collaborators: Collaborator[];
    shortcutsUsers: string[];
    contentUrl?: string;
    isPublished?: boolean;
    publishedUser?: UserProps;
    publishedDate?: { seconds: number, nanoseconds: number };
    savePath?: 'firestore' | 'firebase-storage';
}