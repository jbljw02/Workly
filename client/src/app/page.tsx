import Document from '../../public/svgs/write/document.svg'
import Task from '../../public/svgs/write/task.svg'
import Schedule from '../../public/svgs/write/schedule.svg'
import SearchIcon from '../../public/svgs/search.svg'
import AddTaskIcon from '../../public/svgs/add-task.svg'
import HomeIcon from '../../public/svgs/home.svg'
import DocumentIcon from '../../public/svgs/document.svg'
import TaskIcon from '../../public/svgs/task.svg'
import ScheduleIcon from '../../public/svgs/schedule.svg'
import SidebarItem from '@/components/aside/SidebarItem'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 p-4 pt-7 border-r flex flex-col">
        <div className='flex items-center mb-3 bg-neutral-100 p-1 pl-2 ml-1.5 rounded text-sm'>
          <SearchIcon width="19px" />
          <input
            className='bg-neutral-100 ml-1 border-none outline-none'
            placeholder='검색'
            readOnly />
        </div>
        <div className='border-b border-b-neutral-300 mb-5 mt-2 pb-3'>
          <SidebarItem
            Icon={Document}
            IconWidth='21'
            label='문서 작성' />
          <SidebarItem
            Icon={Task}
            IconWidth='21'
            label='작업 추가' />
          <SidebarItem
            Icon={Schedule}
            IconWidth='22'
            label='일정 추가' />
        </div>
        <div className='mb-4'>
          <SidebarItem
            Icon={HomeIcon}
            IconWidth='20'
            label='홈' />
          <SidebarItem
            Icon={DocumentIcon}
            IconWidth='19'
            label='문서' />
          <SidebarItem
            Icon={TaskIcon}
            IconWidth='19'
            label='작업' />
          <SidebarItem
            Icon={ScheduleIcon}
            IconWidth='19'
            label='일정' />
        </div>
        <div>
        </div>
      </aside>
      <main className="flex-1 p-8">
      </main>
    </div>
  )
}