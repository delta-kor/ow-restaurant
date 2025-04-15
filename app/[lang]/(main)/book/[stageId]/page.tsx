import MenuItemList from '@/components/MenuItemList'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect } from 'effect'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
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

  if (isNaN(stageId)) {
    notFound()
  }

  return <MenuItemList stageId={stageId} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stageId: string; lang: string }>
}): Promise<Metadata> {
  const { stageId: stageIdText, lang } = await params

  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  const stage = recipe.getStage(stageId).pipe(
    Effect.catchTag('RecipeStageNotFoundError', () => Effect.succeed(null)),
    Effect.runSync
  )

  if (stage === null) return notFound()

  return {
    title: `${stage.getName(lang)} - OW Restaurant`,
  } satisfies Metadata
}
