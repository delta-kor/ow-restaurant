'use client'

import Icon from '@/components/Icon'
import { Link } from '@/i18n/routing'
import { recipe } from '@/lib/restaurant/restaurant'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export const StageIconMap = [
  Icon.Steak,
  Icon.Burger,
  Icon.Chicken,
  Icon.Pizza,
  Icon.Dumpling,
  Icon.Egg,
  Icon.Fish,
  Icon.Noodles,
  Icon.Taco,
  Icon.Icecream,
  Icon.Pancake,
  Icon.Meat,
]

export default function StageSelector() {
  const t = useTranslations()
  const locale = useLocale()

  const params = useParams()
  const { stageId: stageIdText } = params
  const stageId = parseInt(stageIdText as string) || 0

  const stages = recipe.stages

  return (
    <div className="flex flex-col gap-8">
      <div className="text-gray text-16 font-bold">{t('stage')}</div>
      <div className="flex flex-wrap gap-8">
        {stages.map((stage) => {
          const IconComponent = StageIconMap[stage.id]
          return (
            <Link
              key={stage.id}
              href={`/book/${stage.id}`}
              data-active={stageId === stage.id}
              className="rounded-8 group data-[active=true]:bg-primary bg-primary-background flex items-center gap-4 px-12 py-6 transition-colors"
            >
              <IconComponent className="text-primary size-16 shrink-0 transition-colors group-data-[active=true]:text-white" />
              <div className="text-14 text-primary font-semibold transition-colors group-data-[active=true]:text-white">
                {stage.getName(locale)}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
