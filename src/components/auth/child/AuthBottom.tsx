type AuthBottomProps = {
    leftLabel: {
        sentence: string;
        btnLabel: string;
    },
    rightLabel: {
        sentence: string;
        btnLabel: string;
    }
}

export default function AuthBottom({ leftLabel, rightLabel }: AuthBottomProps) {
    return (
        <div className='flex justify-between items-center text-sm w-full'>
            <div className='flex flex-row gap-1.5'>
                <div>{leftLabel.sentence}</div>
                <button className='text-blue-600 underline'>{leftLabel.btnLabel}</button>
            </div>
            <div className='flex flex-row gap-1.5'>
                <div>{rightLabel.sentence}</div>
                <button className='text-blue-600 underline'>{rightLabel.btnLabel}</button>
            </div>
        </div>
    )
}