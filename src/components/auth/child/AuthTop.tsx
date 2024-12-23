import Favicon from '../../../../public/svgs/favicon.svg';

type AuthTop = {
    title: string;
    subtitle: string;
}

export default function AuthTop({ title, subtitle }: AuthTop) {
    return (
        <div className='flex flex-col w-full items-center mb-4'>
            <Favicon width="70" />
            <div className='text-3xl font-semibold mt-6'>{title}</div>
            <div className='text-[15px] mt-2'>{subtitle}</div>
        </div>
    )
}