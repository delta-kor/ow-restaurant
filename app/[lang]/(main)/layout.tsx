import Sidebar, { SidebarPlaceholder } from '@/components/Sidebar'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-pc-x-padding flex items-center gap-64">
      <Sidebar />
      <SidebarPlaceholder />
      {children}
    </div>
  )
}
