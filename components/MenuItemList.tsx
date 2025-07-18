'use client'

import { MenuFlowLineInfo } from '@/app/[lang]/(main)/book/[stageId]/page'
import Icon from '@/components/Icon'
import MenuItem, { MenuItemType } from '@/components/MenuItem'
import MenuItemFilterButton from '@/components/MenuItemFilterButton'
import { Recipe } from '@/lib/restaurant/recipe'
import { recipe } from '@/lib/restaurant/restaurant'
import { Solution } from '@/lib/restaurant/solution'
import { filterFlowLineInfosWithSearchQuery } from '@/lib/search'
import { useSettings } from '@/providers/Settings'
import { Effect } from 'effect'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { useState } from 'react'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
  hazardMenuFlowLineInfos: MenuFlowLineInfo[]
  weaverMenuFlowLineInfos: MenuFlowLineInfo[]
  isAdditionalMenuStage: boolean
}

export default function MenuItemList({ stageId }: { stageId: number }) {
  const t = useTranslations()
  const settings = useSettings()

  const [searchText, setSearchText] = useState<string>('')

  const handleFilterChange = (type: MenuItemType, active: boolean) => {
    let newFilter: [boolean, boolean, boolean]
    if (!menuFilter.every((item) => item) && !active) {
      newFilter = [true, true, true]
    } else {
      switch (type) {
        case MenuItemType.Menu:
          newFilter = [true, false, false]
          break
        case MenuItemType.WeaverMenu:
          newFilter = [false, true, false]
          break
        case MenuItemType.HazardMenu:
          newFilter = [false, false, true]
          break
        default:
          newFilter = [true, true, true]
          break
      }
    }

    settings.setData('displayMainMenus', newFilter[0])
    settings.setData('displaySpecialMenus', newFilter[1])
    settings.setData('displaySideMenus', newFilter[2])
  }

  const handleFilterReset = () => {
    settings.setData('displayMainMenus', true)
    settings.setData('displaySpecialMenus', true)
    settings.setData('displaySideMenus', true)
  }

  const menuFilter: [boolean, boolean, boolean] = [
    settings.data.displayMainMenus,
    settings.data.displaySpecialMenus,
    settings.data.displaySideMenus,
  ]

  const program = Effect.gen(function* () {
    const stage = yield* recipe.getStage(stageId)
    const ingredients = stage.fridge

    const menus = [...new Set(stage.menus)]
    const hazardMenus = [
      ...new Set(
        stage.hazardMenus.filter(
          (item) => item.id !== 0 && !ingredients.some((value) => value.id === item.id)
        )
      ),
    ]

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

  const filteredMenuFlowLineInfos = filterFlowLineInfosWithSearchQuery(
    menuFlowLineInfos,
    searchText
  )
  const filteredHazardMenuFlowLineInfos = filterFlowLineInfosWithSearchQuery(
    hazardMenuFlowLineInfos,
    searchText
  )
  const filteredWeaverMenuFlowLineInfos = filterFlowLineInfosWithSearchQuery(
    weaverMenuFlowLineInfos,
    searchText
  )

  const isAdditionalMenuStage = result.isAdditionalMenuStage
  const isFilterActive = menuFilter.some((item) => !item)

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-wrap items-center justify-between gap-x-16 gap-y-8">
        <div className="flex grow items-center gap-16">
          <Icon.Search className="text-light-gray-hover size-28 shrink-0" />
          <input
            autoComplete="off"
            spellCheck={false}
            type="text"
            className="placeholder:text-light-gray-hover text-gray text-28 grow font-medium outline-none"
            placeholder={t('searchItem')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <AnimatePresence>
            {isFilterActive && (
              <motion.div
                key="filter-reset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleFilterReset}
                className="rounded-8 bg-primary-background flex size-[33px] cursor-pointer items-center justify-center"
              >
                <Icon.Close className="text-gray size-12" />
              </motion.div>
            )}
          </AnimatePresence>
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
        {menuFilter[0] && filteredMenuFlowLineInfos.length > 0 && (
          <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
            {filteredMenuFlowLineInfos.map((info) => (
              <MenuItem
                key={info.item.id}
                item={info.item}
                flowLines={info.flowLines}
                type={isAdditionalMenuStage ? MenuItemType.AdditionalStageMenu : MenuItemType.Menu}
              />
            ))}
          </div>
        )}

        {menuFilter[1] && filteredWeaverMenuFlowLineInfos.length > 0 && (
          <div className="mb-16 flex flex-col gap-8">
            <div className="tablet:gap-16 flex items-center gap-12">
              <div className="text-light-gray-hover text-20 tablet:text-24 shrink-0 font-semibold">
                {t('specialMenu')}
              </div>
              <div className="bg-light-gray h-2 grow" />
            </div>
            <div className="tablet:gap-48 bg-primary-background/70 rounded-16 tablet:p-24 flex flex-col gap-32 p-16">
              {filteredWeaverMenuFlowLineInfos.map((info) => (
                <MenuItem
                  key={info.item.id}
                  item={info.item}
                  flowLines={info.flowLines}
                  type={MenuItemType.WeaverMenu}
                />
              ))}
            </div>
          </div>
        )}

        {menuFilter[2] && filteredHazardMenuFlowLineInfos.length > 0 && (
          <div className="mb-16 flex flex-col gap-8">
            <div className="tablet:gap-16 flex items-center gap-12">
              <div className="text-light-gray-hover text-20 tablet:text-24 shrink-0 font-semibold">
                {t('sideMenu')}
              </div>
              <div className="bg-light-gray h-2 grow" />
            </div>
            <div className="tablet:gap-48 bg-light-gray/40 rounded-16 tablet:p-24 flex flex-col gap-32 p-16">
              {filteredHazardMenuFlowLineInfos.map((info) => (
                <MenuItem
                  key={info.item.id}
                  item={info.item}
                  flowLines={info.flowLines}
                  type={MenuItemType.HazardMenu}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
