import Sidebar, { SidebarPlaceholder } from '@/components/Sidebar'
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
    <div className="px-pc-x-padding flex items-center gap-64">
      <Sidebar />
      <SidebarPlaceholder />
      {children}
    </div>
  )
}
