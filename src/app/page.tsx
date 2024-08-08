import Aside from '@/components/aside/Aside'
import Editor from '@/components/editor/Editor'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* 좌측 슬라이드바 */}
      <Aside />
      <Editor />
    </div>
  )
}