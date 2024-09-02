type ToolbarButtonProps = {
    onClick?: () => void;
    isActive?: boolean;
    Icon: React.ElementType;
    iconWidth: number;
    isFont?: boolean;
    iconFill?: string;
}

export default function ToolbarButton({ onClick, isActive, Icon, iconWidth, isFont, iconFill }: ToolbarButtonProps) {

    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center p-1 rounded-sm ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            style={{
                width: `${isFont ? '25px' : '35px'}`,
                height: `${isFont ? '25px' : '35px'}`,
                transition: 'background-color 0.1s ease'
            }}>
            <Icon
                width={iconWidth}
                height="auto"
                {...(iconFill && { style: { color: iconFill } })} />
        </button>
    )
}