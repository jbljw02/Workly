import { SidebarItemProps } from "@/type/sidebarProps";

export default function SidebarItem({ Icon, IconWidth, label }: SidebarItemProps) {
    return (
        <div className='flex items-center pl-2 pt-2 pb-2 w-full rounded cursor-pointer hover:bg-neutral-100'>
            <Icon width={IconWidth} />
            <span className='ml-2.5 text-sm'>{label}</span>
        </div>
    )
}