type ToolbarButtonProps = {
    Icon: React.ElementType;
    onClick?: () => void;
    iconWidth: number;
    nonClick?: boolean;
    isActive?: boolean;
    iconFill?: string;
}

export default function ToolbarButton({ onClick, isActive, Icon, iconWidth, nonClick, iconFill }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center p-1 rounded-sm 
                ${isActive && !nonClick ? 'bg-gray-100' : ''} 
                ${!nonClick ? 'hover:bg-gray-100' : 'cursor-default'}`}
            style={{
                width: `30px`,
                height: `30px`,
                transition: 'background-color 0.1s ease'
            }}>
            <Icon
                width={iconWidth}
                height={iconWidth}
                {...(iconFill && { style: { color: iconFill } })} />
        </button>
    )
}