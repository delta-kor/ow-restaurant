'use client'

import Icon from '@/components/Icon'
import { useTranslations } from 'next-intl'

export default function WorkshopCode() {
  const t = useTranslations()

  const handleCopy = (code: string) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => alert(t('copiedCode')))
        .catch((err) => console.error('Failed to copy: ', err))
    }
  }

  return (
    <div className="flex flex-col gap-8 self-start">
      <div className="text-gray text-16 font-bold">{t('workshopCode')}</div>
      <div className="flex flex-col gap-4">
        <div
          className="flex cursor-pointer items-center gap-12"
          onClick={() => handleCopy('SPXXM')}
        >
          <div className="text-primary-light text-18 w-72 font-semibold">한국어</div>
          <div className="text-primary text-18 w-64 font-bold">SPXXM</div>
          <Icon.Copy className="text-primary-light size-20" />
        </div>
        <div
          className="flex cursor-pointer items-center gap-12"
          onClick={() => handleCopy('HTNZ3')}
        >
          <div className="text-primary-light text-18 w-72 font-semibold">English</div>
          <div className="text-primary text-18 w-64 font-bold">HTNZ3</div>
          <Icon.Copy className="text-primary-light size-20" />
        </div>
        <div
          className="flex cursor-pointer items-center gap-12"
          onClick={() => handleCopy('4ND1P')}
        >
          <div className="text-primary-light text-18 w-72 font-semibold">日本語</div>
          <div className="text-primary text-18 w-64 font-bold">4ND1P</div>
          <Icon.Copy className="text-primary-light size-20" />
        </div>
      </div>
    </div>
  )
}
