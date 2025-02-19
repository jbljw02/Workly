import { UserProps } from "@/types/user.type";
import { Collaborator } from "./document.type";

export type Folder = {
    id: string;
    name: string;
    documentIds: string[];
    author: UserProps;
    collaborators?: Collaborator[];
    createdAt: string;
    readedAt: string;
}