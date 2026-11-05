'use client'
import Icon from '@/components/Icon'
import { Link, useRouter } from '@/i18n/routing'
import { bookHref, parseBookPath } from '@/lib/restaurant/catalog'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import LanguageSelector from './LanguageSelector'
import RestaurantSelector from './RestaurantSelector'
import './stage-selector.css'
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
  const locale = useLocale(),
    t = useTranslations(),
    router = useRouter()
  const [casualOnly, setCasualOnly] = useState(false)
  const { bookPath } = useParams<{ bookPath: string[] }>()
  const selected = parseBookPath(bookPath)

  if (!selected) return null
  const stages = getRecipe(selected.theme, locale).stages

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-wrap items-end justify-between gap-12">
        <div className="flex flex-wrap items-end gap-12">
          <RestaurantSelector value={selected.theme} onChange={(id) => router.push(bookHref(id))} />
          <div
            data-active={casualOnly}
            className="text-gray text-14 bg-primary-background rounded-12 flex cursor-pointer items-center gap-8 px-14 py-10 font-semibold select-none"
            onClick={() => setCasualOnly(!casualOnly)}
          >
            <div
              data-active={casualOnly}
              className="bg-light-gray-hover data-[active=true]:bg-primary size-8 rounded-full"
            />
            {t('casualDiningOnly')}
          </div>
        </div>
        <LanguageSelector />
      </div>
      <div className="text-gray text-16 font-bold">{t('dishCategory')}</div>
      <div className="flex flex-wrap gap-8">
        {stages.map((stage) =>
          casualOnly && !stage.casualDining ? null : (
            <Link
              key={stage.id}
              href={bookHref(selected.theme, stage.id)}
              data-active={selected.stage === stage.id}
              data-casual={stage.casualDining}
              data-muted={casualOnly && !stage.casualDining}
              aria-current={selected.stage === stage.id ? 'page' : undefined}
              className="recipe-category rounded-8 text-14 px-12 py-6 font-semibold transition-colors"
            >
              {stage.getName(locale)}
            </Link>
          )
        )}
      </div>
    </div>
  )
}
