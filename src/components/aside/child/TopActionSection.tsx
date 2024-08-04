import Document from '../../../../public/svgs/write/document.svg'
import Task from '../../../../public/svgs/write/task.svg'
import Schedule from '../../../../public/svgs/write/schedule.svg'
import SidebarItem from '@/components/aside/child/SidebarItem'
import SearchInput from '@/components/aside/child/SearchInput'

export default function TopActionSection() {
    return (
        <>
            <SearchInput />
            <div className='border-b border-b-neutral-300 mb-5 mt-2 pb-3'>
                <SidebarItem
                    Icon={Document}
                    IconWidth='20'
                    label='문서 작성' />
                <SidebarItem
                    Icon={Task}
                    IconWidth='20'
                    label='작업 추가' />
                <SidebarItem
                    Icon={Schedule}
                    IconWidth='22'
                    label='일정 추가' />
            </div>
        </>
    )
}