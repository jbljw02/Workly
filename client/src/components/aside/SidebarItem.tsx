import { SidebarItemProps } from "@/type/sidebarProps";

export default function SidebarItem({ Icon, IconWidth, label }: SidebarItemProps) {
    return (
        <div className='flex items-center mb-3 pl-2 w-full'>
            <Icon width={IconWidth} />
            <span className='ml-3 text-sm'>{label}</span>
        </div>
    )
}