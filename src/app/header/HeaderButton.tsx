import { useRouter } from 'next/navigation';
import BackIcon from '../../../public/svgs/back.svg';
import CloseIcon from '../../../public/svgs/close.svg'

export default function HeaderButton() {
    const router = useRouter();

    return (
        <header className="flex justify-between items-center w-full px-8 py-4 fixed top-3 left-0 z-50">
            <button
                type="button"
                onClick={() => router.back()}>
                <BackIcon width="20" />
            </button>
            <button
                type="button"
                onClick={() => router.push('/')}>
                <CloseIcon width="20" />
            </button>
        </header>
    )
}