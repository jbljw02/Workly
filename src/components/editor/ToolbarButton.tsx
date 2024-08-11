type ToolbarButtonProps = {
    onClick?: () => void;
    isActive?: boolean;
    Icon: React.ElementType;
    iconWidth: number;
}

export default function ToolbarButton({ onClick, isActive, Icon, iconWidth }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`p-2 hover:bg-gray-300 ${isActive ? 'bg-gray-300' : ''}`}>
            <Icon width={iconWidth} />
        </button>
    )
}