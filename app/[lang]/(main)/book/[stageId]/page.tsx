import MenuItem from '@/components/MenuItem'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { FlowLine, Solution } from '@/lib/restaurant/solution'
import { Effect } from 'effect'
import { notFound } from 'next/navigation'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
}

export interface MenuFlowLineInfo {
  item: Item
  flowLines: FlowLine[]
}

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId: stageIdText } = await params
  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  const program = Effect.gen(function* () {
    const stage = yield* recipe.getStage(stageId)
    const ingredients = stage.fridge
    const menus = stage.menus

    const menuFlowLineInfos: MenuFlowLineInfo[] = []
    for (const menu of menus.slice(16, 17)) {
      const flowLines = yield* Solution.solve(menu, ingredients)
      menuFlowLineInfos.push({ item: menu, flowLines })
    }

    const result: StagePageExecuteResult = {
      menuFlowLineInfos,
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

  return (
    <div className="flex flex-col gap-72">
      {menuFlowLineInfos.map((info) => (
        <MenuItem key={info.item.id} item={info.item} flowLines={info.flowLines} />
      ))}
    </div>
  )
}
