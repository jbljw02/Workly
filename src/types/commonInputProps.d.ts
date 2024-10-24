export type InputProps = {
    type: string;
    value: string;
    placeholder: string;
    isInvalidInfo?: { isInvalid: boolean, msg: string | null };
    autoFocus?: boolean;
}