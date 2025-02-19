export type ConnectedUser = {
    name: string;
    id: string;
    color: string;
    photoURL: string;
    connectedAt: number;
}

export type UserProps = {
    email: string;
    displayName: string;
    photoURL: string;
    uid: string;
};