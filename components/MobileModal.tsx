'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function MobileModal() {
  const t = useTranslations()
  const [isModalClosed, setIsModalClosed] = useState(false)

  if (isModalClosed) return null

  return (
    <div className="tablet:hidden bg-gray/30 fixed inset-0 bottom-[80px] z-10 flex w-dvw items-center justify-center p-16">
      <div className="rounded-16 flex flex-col gap-2 bg-white p-16">
        <div className="text-18 font-semibold text-black">{t('mobileModal1')}</div>
        <div className="text-gray text-16 font-medium">{t('mobileModal2')}</div>
        <div
          className="text-primary-light text-16 mt-16 self-stretch font-medium underline"
          onClick={() => setIsModalClosed(true)}
        >
          {t('mobileModalIgnore')}
        </div>
      </div>
    </div>
  )
}
