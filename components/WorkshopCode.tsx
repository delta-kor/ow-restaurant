'use client'

import Icon from '@/components/Icon'
import { CustomRestaurantInfos, FormUrl } from '@/lib/restaurant/custom'
import { useTranslations } from 'next-intl'

const RestaurantInfos: { name: string; code: string }[] = [
  {
    name: '한국어',
    code: 'SPXXM',
  },
  {
    name: 'English',
    code: 'HTNZ3',
  },
  {
    name: '日本語',
    code: '4ND1P',
  },
  {
    name: '中文',
    code: 'RCST4',
  },
  {
    name: '中文(亚洲)',
    code: 'DBFHB',
  },
]

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
    <div className="tablet:flex-row flex flex-col gap-36">
      <div className="tablet:min-w-[280px] flex flex-col gap-8">
        <div className="text-gray text-16 font-bold">{t('workshopCode')}</div>
        <div className="flex flex-col gap-4">
          {RestaurantInfos.map((info) => (
            <div
              key={info.code}
              className="flex cursor-pointer items-center gap-12"
              onClick={() => handleCopy(info.code)}
            >
              <div className="text-primary-light text-18 grow font-semibold">{info.name}</div>
              <div className="text-primary text-18 font-bold">{info.code}</div>
              <Icon.Copy className="text-primary-light size-20 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="tablet:min-w-[280px] flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="text-gray text-16 font-bold">{t('customRestaurant')}</div>
          <a href={FormUrl} target="_blank" className="text-14 text-primary cursor-pointer">
            {t('add')}
          </a>
        </div>
        <div className="flex flex-col gap-4">
          {CustomRestaurantInfos.map((info) => (
            <div
              key={info.recipeId}
              className="flex cursor-pointer items-center gap-12"
              onClick={() => handleCopy(info.code)}
            >
              <div className="text-primary-light text-18 grow font-semibold">{info.name}</div>
              <div className="text-primary text-18 font-bold">{info.code}</div>
              <Icon.Copy className="text-primary-light size-20 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
