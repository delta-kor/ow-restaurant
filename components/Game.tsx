'use client'

import GameStageMenus from '@/components/GameStageMenus'
import GameStageSelector from '@/components/GameStageSelector'
import GameTutorial from '@/components/GameTutorial'
import GameView from '@/components/GameView'
import { ThemeId, resolveTheme } from '@/lib/restaurant/catalog'
import { Item } from '@/lib/restaurant/item'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { useSettings } from '@/providers/Settings'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LanguageSelector from './LanguageSelector'
import RestaurantSelector from './RestaurantSelector'

export default function Game() {
  const settings = useSettings()
  const locale = useLocale()
  const params = useSearchParams()
  const router = useRouter()
  const theme = resolveTheme(params.get('theme')) ?? 'default-classic'
  const recipe = getRecipe(theme, locale)

  const requested = Number(params.get('stage') ?? 0)
  const stageId =
    Number.isInteger(requested) && requested >= 0 && requested < recipe.stages.length
      ? requested
      : 0
  const select = (id: ThemeId, stage: number) =>
    router.replace(`/${locale}/sandbox?theme=${id}&stage=${stage}`)
  const [createdItems, setCreatedItems] = useState<Item[]>([])

  useEffect(() => {
    setCreatedItems([])
  }, [stageId, theme, locale])

  const handleItemCreate = (item: Item) => {
    if (!createdItems.some((value) => value.id === item.id)) {
      setCreatedItems((prev) => [...prev, item])
    }
  }

  return (
    <div className="tablet:max-h-none tablet:max-w-none flex max-h-[calc(100dvh-80px)] max-w-[calc(100dvw-32px)] grow items-start gap-16 overflow-auto">
      <div className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end gap-16">
          <RestaurantSelector value={theme} onChange={(id) => select(id, 0)} />
          <LanguageSelector />
        </div>
        <div className="flex flex-col">
          <div className="flex items-end justify-between">
            <div className="text-primary-light text-32 font-semibold">Sandbox</div>
            <GameStageSelector
              recipe={recipe}
              stageId={stageId}
              onStageSelect={(stage) => select(theme, stage)}
            />
          </div>
          <GameView
            key={`${theme}:${locale}:${stageId}`}
            recipe={recipe}
            stageId={stageId}
            onItemCreate={handleItemCreate}
          />
        </div>
        <GameTutorial />
      </div>
      {settings.data.displayMenuList && (
        <GameStageMenus recipe={recipe} stageId={stageId} createdItems={createdItems} />
      )}
    </div>
  )
}
