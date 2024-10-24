export type InvalidInfo = {
    isInvalid: boolean;
    msg: string;
}

export type SetInvalidInfo = Dispatch<SetStateAction<InvalidInfo>>;