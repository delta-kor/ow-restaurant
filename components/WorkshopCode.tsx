'use client'

import Icon from '@/components/Icon'
import { CustomRestaurantInfos } from '@/lib/restaurant/custom'
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
    <div className="flex flex-wrap gap-36">
      <div className="flex flex-col gap-8 self-start">
        <div className="text-gray text-16 font-bold">{t('workshopCode')}</div>
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-12"
            onClick={() => handleCopy('SPXXM')}
          >
            <div className="text-primary-light text-18 w-96 font-semibold">한국어</div>
            <div className="text-primary text-18 w-64 font-bold">SPXXM</div>
            <Icon.Copy className="text-primary-light size-20" />
          </div>
          <div
            className="flex cursor-pointer items-center gap-12"
            onClick={() => handleCopy('HTNZ3')}
          >
            <div className="text-primary-light text-18 w-96 font-semibold">English</div>
            <div className="text-primary text-18 w-64 font-bold">HTNZ3</div>
            <Icon.Copy className="text-primary-light size-20" />
          </div>
          <div
            className="flex cursor-pointer items-center gap-12"
            onClick={() => handleCopy('4ND1P')}
          >
            <div className="text-primary-light text-18 w-96 font-semibold">日本語</div>
            <div className="text-primary text-18 w-64 font-bold">4ND1P</div>
            <Icon.Copy className="text-primary-light size-20" />
          </div>
          <div
            className="flex cursor-pointer items-center gap-12"
            onClick={() => handleCopy('RCST4')}
          >
            <div className="text-primary-light text-18 w-96 font-semibold">中文</div>
            <div className="text-primary text-18 w-64 font-bold">RCST4</div>
            <Icon.Copy className="text-primary-light size-20" />
          </div>
          <div
            className="flex cursor-pointer items-center gap-12"
            onClick={() => handleCopy('DBFHB')}
          >
            <div className="text-primary-light text-18 w-96 font-semibold">中文(亚洲)</div>
            <div className="text-primary text-18 w-64 font-bold">DBFHB</div>
            <Icon.Copy className="text-primary-light size-20" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 self-start">
        <div className="text-gray text-16 font-bold">{t('customRestaurant')}</div>
        <div className="flex flex-col gap-4">
          {CustomRestaurantInfos.map((info) => (
            <div
              key={info.recipeId}
              className="flex cursor-pointer items-center gap-12"
              onClick={() => handleCopy(info.code)}
            >
              <div className="text-primary-light text-18 w-96 font-semibold">{info.name}</div>
              <div className="text-primary text-18 w-80 font-bold">{info.code}</div>
              <Icon.Copy className="text-primary-light size-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
