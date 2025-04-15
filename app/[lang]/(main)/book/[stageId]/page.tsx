import MenuItem from '@/components/MenuItem'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { FlowLine, Solution } from '@/lib/restaurant/solution'
import { Effect } from 'effect'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
  hazardMenuFlowLineInfos: MenuFlowLineInfo[]
}

export interface MenuFlowLineInfo {
  item: Item
  flowLines: FlowLine[]
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stageId: string; lang: string }>
}) {
  const { stageId: stageIdText, lang } = await params
  setRequestLocale(lang)

  const stageId = parseInt(stageIdText)
  const t = await getTranslations()

  if (isNaN(stageId)) {
    notFound()
  }

  const program = Effect.gen(function* () {
    const stage = yield* recipe.getStage(stageId)
    const ingredients = stage.fridge

    const menus = [...new Set(stage.menus)]
    const hazardMenus = stage.hazardMenus

    const menuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const menu of menus) {
      const flowLines = yield* Solution.solve(menu, ingredients)
      menuFlowLineInfos.push({ item: menu, flowLines })
    }

    const hazardMenuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const hazardMenu of hazardMenus) {
      if (hazardMenu.id === 0) continue
      const flowLines = yield* Solution.solve(hazardMenu, ingredients)
      hazardMenuFlowLineInfos.push({ item: hazardMenu, flowLines })
    }

    const result: StagePageExecuteResult = {
      menuFlowLineInfos,
      hazardMenuFlowLineInfos,
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

  return (
    <div className="flex flex-col gap-32">
      <div className="tablet:gap-72 flex flex-col gap-64 pb-32">
        {menuFlowLineInfos.map((info) => (
          <MenuItem key={info.item.id} item={info.item} flowLines={info.flowLines} />
        ))}
      </div>
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
    </div>
  )
}
