import StageSelector from '@/components/StageSelector'
import { recipe } from '@/lib/restaurant/restaurant'
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
    <div className="tablet:pt-tablet-y-padding pc:pt-pc-y-padding pt-mobile-y-padding tablet:mr-0 tablet:pr-0 tablet:gap-64 -mx-24 -mr-16 flex grow flex-col gap-48 overflow-hidden px-24 pr-16">
      <StageSelector />
      {children}
    </div>
  )
}

export function generateStaticParams() {
  const stagesLength = recipe.stages.length
  return Array.from({ length: stagesLength }, (_, i) => ({
    stageId: i.toString(),
  }))
}
