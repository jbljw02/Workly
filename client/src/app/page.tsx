import Aside from '@/components/aside/Aside'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* 좌측 슬라이드바 */}
      <Aside />
    </div>
  )
}