import HomeIcon from '../../../../public/svgs/home.svg'
import DocumentIcon from '../../../../public/svgs/document.svg'
import TaskIcon from '../../../../public/svgs/task.svg'
import ScheduleIcon from '../../../../public/svgs/schedule.svg'
import SidebarItem from '@/components/aside/child/SidebarItem'

export default function MenuSection() {
    return (
        <div className='mb-6'>
            <SidebarItem
                Icon={HomeIcon}
                IconWidth='19'
                label='홈' />
            <SidebarItem
                Icon={DocumentIcon}
                IconWidth='18'
                label='문서' />
            <SidebarItem
                Icon={TaskIcon}
                IconWidth='18'
                label='작업' />
            <SidebarItem
                Icon={ScheduleIcon}
                IconWidth='18'
                label='일정' />
        </div>
    )
}