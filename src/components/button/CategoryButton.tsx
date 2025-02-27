import LockIcon from '../../../public/svgs/editor/lock.svg';

type CategoryButtonProps = {
    label: string;
    activated: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export default function CategoryButton({ label, activated, onClick, disabled }: CategoryButtonProps) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={` relative flex items-center gap-1.5 text-xs px-2 py-1 border rounded-md transition-all duration-200
                ${disabled ?
                    'border-gray-200 text-gray-300 cursor-not-allowed' :
                    'border-gray-300 text-neutral-500 hover:bg-neutral-100'
                }
                ${activated ? 'bg-neutral-100' : ''}
            `}>
            {disabled && <LockIcon width="12" className="text-gray-300" />}
            {label}
        </button>
    )
}