type ToolbarButtonProps = {
    onClick?: () => void;
    isActive?: boolean;
    Icon: React.ElementType;
    iconWidth: number;
    iconFill?: string;
}

export default function ToolbarButton({ onClick, isActive, Icon, iconWidth, iconFill }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center p-1 rounded-sm 
                ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            style={{
                width: `30px`,
                height: `30px`,
                transition: 'background-color 0.1s ease'
            }}>
            <Icon
                width={iconWidth}
                height="auto"
                {...(iconFill && { style: { color: iconFill } })} />
        </button>
    )
}