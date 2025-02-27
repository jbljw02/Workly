import LockIcon from '../../../public/svgs/editor/lock.svg';

export type MenuItemProps = {
    Icon: React.ElementType;
    IconWidth: string;
    label: string;
    onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    horizonLine?: boolean;
    disabled?: boolean;
};

export default function MenuItem({ Icon, IconWidth, label, onClick, disabled }: MenuItemProps) {
    const itemClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        if (!disabled && onClick) {
            onClick(e);
        }
    };

    return (
        // 데모 버전에서는 사용할 수 없는 기능 시각화
        <li
            className={`flex flex-row items-center w-full py-1 pl-3 pr-10 select-none
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}
            `}
            onClick={itemClick}>
            {
                disabled ?
                    <LockIcon width="16" className="text-gray-400" /> :
                    <Icon width={IconWidth} />
            }
            <div className={`ml-2 ${disabled ? 'text-gray-400' : ''}`}>{label}</div>
        </li>
    )
}