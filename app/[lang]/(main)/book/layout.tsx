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
    <div className="tablet:pt-tablet-y-padding pc:pt-pc-y-padding pt-mobile-y-padding tablet:mr-0 tablet:pr-0 tablet:gap-72 -mr-16 flex flex-col gap-64 overflow-hidden pr-16">
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
