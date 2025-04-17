'use client'

import { MenuFlowLineInfo } from '@/app/[lang]/(main)/book/[stageId]/page'
import Icon from '@/components/Icon'
import MenuItem, { MenuItemType } from '@/components/MenuItem'
import MenuItemFilterButton from '@/components/MenuItemFilterButton'
import { Recipe } from '@/lib/restaurant/recipe'
import { recipe } from '@/lib/restaurant/restaurant'
import { Solution } from '@/lib/restaurant/solution'
import { useSettings } from '@/providers/Settings'
import { Effect } from 'effect'
import { useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { Fragment, useState } from 'react'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
  hazardMenuFlowLineInfos: MenuFlowLineInfo[]
  weaverMenuFlowLineInfos: MenuFlowLineInfo[]
  isAdditionalMenuStage: boolean
}

export default function MenuItemList({ stageId }: { stageId: number }) {
  const t = useTranslations()
  const settings = useSettings()

  const [menuFilter, setMenuFilter] = useState<[boolean, boolean, boolean]>([true, true, true])

  const handleFilterChange = (type: MenuItemType, active: boolean) => {
    const newFilter: [boolean, boolean, boolean] = [...menuFilter]
    switch (type) {
      case MenuItemType.Menu:
        newFilter[0] = active
        break
      case MenuItemType.WeaverMenu:
        newFilter[1] = active
        break
      case MenuItemType.HazardMenu:
        newFilter[2] = active
        break
    }

    if (newFilter.every((filter) => !filter)) {
      return
    }

    setMenuFilter(newFilter)
  }

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
      isAdditionalMenuStage,
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
  const isAdditionalMenuStage = result.isAdditionalMenuStage

  return (
    <div className="flex flex-col gap-32">
      <div className="flex items-center justify-between">
        <div className="flex grow items-center gap-16">
          <Icon.Search className="text-light-gray-hover size-28" />
          <input
            autoComplete="off"
            spellCheck={false}
            type="text"
            className="placeholder:text-light-gray-hover text-gray text-28 grow font-medium outline-none"
            placeholder={'아이템 검색'}
          />
        </div>
        <div className="flex items-center gap-8">
          <MenuItemFilterButton
            active={menuFilter[0]}
            onActiveChange={(active) => handleFilterChange(MenuItemType.Menu, active)}
            type={MenuItemType.Menu}
          />
          <MenuItemFilterButton
            active={menuFilter[1]}
            onActiveChange={(active) => handleFilterChange(MenuItemType.WeaverMenu, active)}
            type={MenuItemType.WeaverMenu}
          />
          <MenuItemFilterButton
            active={menuFilter[2]}
            onActiveChange={(active) => handleFilterChange(MenuItemType.HazardMenu, active)}
            type={MenuItemType.HazardMenu}
          />
        </div>
      </div>

      <div className="flex flex-col gap-32">
        <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
          {menuFlowLineInfos.map((info) => (
            <MenuItem
              key={info.item.id}
              item={info.item}
              flowLines={info.flowLines}
              type={isAdditionalMenuStage ? MenuItemType.AdditionalStageMenu : MenuItemType.Menu}
            />
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
                <MenuItem
                  key={info.item.id}
                  item={info.item}
                  flowLines={info.flowLines}
                  type={MenuItemType.WeaverMenu}
                />
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
                <MenuItem
                  key={info.item.id}
                  item={info.item}
                  flowLines={info.flowLines}
                  type={MenuItemType.HazardMenu}
                />
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}
