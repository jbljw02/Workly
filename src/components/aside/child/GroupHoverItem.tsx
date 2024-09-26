type GroupHoverProps = {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    IconWidth: number;
    onClick?: (e: React.MouseEvent) => void;
}

export default function GroupHoverItem({ onClick, Icon, IconWidth }: GroupHoverProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-shrink-0 items-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className='flex justify-center p-1 items-center hover:bg-gray-200 rounded-sm'>
                <Icon
                    width={IconWidth}
                    className="hover:bg-gray-200 rounded-sm" />
            </div>
        </button>
    )
}