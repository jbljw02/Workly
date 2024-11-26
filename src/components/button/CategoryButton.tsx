export default function CategoryButton({ label, activated, onClick }: { label: string, activated: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`text-xs text-neutral-500 px-2 py-1 border border-gray-300 rounded-md hover:bg-neutral-100 transition-all duration-200
            ${activated ? 'bg-neutral-100' : ''}`}>
            {label}
        </button>
    )
}