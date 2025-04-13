import StageSelector from '@/components/StageSelector'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <div className="pt-pc-y-padding flex flex-col gap-72 overflow-hidden">
      <StageSelector />
      {children}
    </div>
  )
}

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    stageId: i.toString(),
  }))
}
