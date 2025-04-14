import Sidebar, { SidebarPcPlaceholder } from '@/components/Sidebar'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <div className="px-mobile-x-padding tablet:px-pc-x-padding pc:gap-64 tablet:pb-0 flex items-center gap-32 pb-80">
      <Sidebar />
      <SidebarPcPlaceholder />
      {children}
    </div>
  )
}
