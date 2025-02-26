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
    isDemo?: boolean;
};

export type JWTToken = {
    uid: string;
    email: string;
    displayName: string;
    isDemo: boolean;
    exp: number;
};