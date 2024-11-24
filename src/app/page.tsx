import Home from '@/components/home/Home'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Workly',
}

export default function Page() {
  return (
    <Home />
  )
}