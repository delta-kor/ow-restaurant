'use client'

import { MenuFlowLineInfo } from '@/app/[lang]/(main)/book/[stageId]/page'
import MenuItem from '@/components/MenuItem'
import { Recipe } from '@/lib/restaurant/recipe'
import { recipe } from '@/lib/restaurant/restaurant'
import { Solution } from '@/lib/restaurant/solution'
import { useSettings } from '@/providers/Settings'
import { Effect } from 'effect'
import { useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
  hazardMenuFlowLineInfos: MenuFlowLineInfo[]
  weaverMenuFlowLineInfos: MenuFlowLineInfo[]
}

export default function MenuItemList({ stageId }: { stageId: number }) {
  const t = useTranslations()
  const settings = useSettings()

  const program = Effect.gen(function* () {
    const stage = yield* recipe.getStage(stageId)
    const ingredients = stage.fridge

    const menus = [...new Set(stage.menus)]
    const hazardMenus = [...new Set(stage.hazardMenus)]

    const isAdditionalMenuStage = Recipe.isAdditionalMenuStage(stage)

    const menuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const menu of menus) {
      const flowLines = yield* Solution.solve(menu, ingredients, isAdditionalMenuStage)
      menuFlowLineInfos.push({ item: menu, flowLines })
    }

    const hazardMenuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const hazardMenu of hazardMenus) {
      if (hazardMenu.id === 0) continue
      const flowLines = yield* Solution.solve(hazardMenu, ingredients, isAdditionalMenuStage)
      hazardMenuFlowLineInfos.push({ item: hazardMenu, flowLines })
    }

    const weaverMenuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const weaverMenu of stage.weaverMenus) {
      const flowLines = yield* Solution.solve(weaverMenu, ingredients, true)
      weaverMenuFlowLineInfos.push({ item: weaverMenu, flowLines })
    }

    const result: StagePageExecuteResult = {
      menuFlowLineInfos,
      hazardMenuFlowLineInfos,
      weaverMenuFlowLineInfos,
    }

    return result
  })

  const caughtProgram = program.pipe(
    Effect.catchTag('RecipeStageNotFoundError', () => Effect.succeed(null))
  )

  const runnableProgram = caughtProgram.pipe(Effect.provide(recipe.getLayer()))

  const result = Effect.runSync(runnableProgram)
  if (result === null) {
    notFound()
  }

  const menuFlowLineInfos = result.menuFlowLineInfos
  const hazardMenuFlowLineInfos = result.hazardMenuFlowLineInfos
  const weaverMenuFlowLineInfos = result.weaverMenuFlowLineInfos

  return (
    <div className="flex flex-col gap-32">
      <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
        {menuFlowLineInfos.map((info) => (
          <MenuItem key={info.item.id} item={info.item} flowLines={info.flowLines} />
        ))}
      </div>

      {settings.data.displaySideMenus && (
        <Fragment>
          <div className="tablet:gap-16 flex items-center gap-12">
            <div className="text-light-gray-hover text-20 tablet:text-24 shrink-0 font-semibold">
              {t('specialMenu')}
            </div>
            <div className="bg-light-gray h-2 grow" />
          </div>
          <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
            {weaverMenuFlowLineInfos.map((info) => (
              <MenuItem key={info.item.id} item={info.item} flowLines={info.flowLines} />
            ))}
          </div>
        </Fragment>
      )}

      {settings.data.displaySideMenus && (
        <Fragment>
          <div className="tablet:gap-16 flex items-center gap-12">
            <div className="text-light-gray-hover text-20 tablet:text-24 shrink-0 font-semibold">
              {t('sideMenu')}
            </div>
            <div className="bg-light-gray h-2 grow" />
          </div>
          <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
            {hazardMenuFlowLineInfos.map((info) => (
              <MenuItem key={info.item.id} item={info.item} flowLines={info.flowLines} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}
