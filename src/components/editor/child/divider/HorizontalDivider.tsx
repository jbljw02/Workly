export default function HorizontalDivider({ borderColor }: { borderColor: string }) {
    return (
        <div className={`w-full border-t ${borderColor} my-1.5`} />
    )
}