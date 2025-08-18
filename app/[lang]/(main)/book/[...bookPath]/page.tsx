import MenuItemList from '@/components/MenuItemList'
import { Item } from '@/lib/restaurant/item'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect } from 'effect'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export interface MenuFlowLineInfo {
  item: Item
  flowLines: FlowLine[]
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ bookPath: string[]; lang: string }>
}) {
  const { bookPath, lang } = await params
  setRequestLocale(lang)

  if (bookPath.length !== 1 && bookPath.length !== 2) notFound()

  let stageIdText: string
  switch (bookPath.length) {
    case 1:
      stageIdText = bookPath[0]
      break
    case 2:
      stageIdText = bookPath[1]
      break
  }

  const recipeId = bookPath.length === 1 ? null : bookPath[0]
  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  return <MenuItemList stageId={stageId} recipeId={recipeId} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookPath: string[]; lang: string }>
}): Promise<Metadata> {
  const { bookPath, lang } = await params

  if (bookPath.length !== 1 && bookPath.length !== 2) notFound()

  let stageIdText: string
  switch (bookPath.length) {
    case 1:
      stageIdText = bookPath[0]
      break
    case 2:
      stageIdText = bookPath[1]
      break
  }

  const recipeId = bookPath.length === 1 ? null : bookPath[0]
  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  const stage = getRecipe(recipeId)
    .getStage(stageId)
    .pipe(
      Effect.catchTag('RecipeStageNotFoundError', () => Effect.succeed(null)),
      Effect.runSync
    )

  if (stage === null) return notFound()

  return {
    title: `${stage.getName(lang)} - OW Restaurant`,
  } satisfies Metadata
}
