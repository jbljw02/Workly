import { Metadata } from 'next'
import RootLayoutClient from './RootLayoutClient'

export const metadata: Metadata = {
  title: {
    default: 'Workly | 실시간 문서 협업 플랫폼',
    template: '%s'
  },
  description: '문서를 작성하고, 팀원들과 실시간으로 공유해보세요. 텍스트, 이미지, 파일, 모든 것이 실시간으로 공유됩니다.',
  // Open Graph(SNS 공유 시)
  openGraph: {
    title: 'Workly - 실시간 문서 협업 플랫폼',
    description: '문서를 작성하고, 팀원들과 실시간으로 공유해보세요. 텍스트, 이미지, 파일, 모든 것이 실시간으로 공유됩니다.',
    url: 'https://www.workly.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/pngs/og-img.png',
        width: 1200,
        height: 630,
        alt: 'Workly Preview'
      }
    ],
  },
  // 검색엔진 크롤링 설정
  robots: {
    index: true, // 검색 결과에 포함
    follow: true, // 링크 추적
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// 서버 컴포넌트인 레이아웃
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}