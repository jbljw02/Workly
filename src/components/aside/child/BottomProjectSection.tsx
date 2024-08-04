import SidebarItem from '@/components/aside/child/SidebarItem'
import ProjectIcon from '../../../../public/svgs/project.svg'
import SettingIcon from '../../../../public/svgs/setting.svg'

export default function BottomProjectSection() {
    return (
        <div className='text-sm'>
            <SidebarItem
                Icon={ProjectIcon}
                IconWidth='20'
                label='내 프로젝트' />
            <SidebarItem
                Icon={SettingIcon}
                IconWidth='20'
                label='프로젝트 설정' />
        </div>
    )
}