import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import { notFound } from 'next/navigation'

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId: stageIdText } = await params
  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  !recipe.getStage(stageId).pipe(
    Effect.catchTag('RecipeStageNotFoundError', () => Effect.succeed(false)),
    Effect.runSync
  ) && notFound()

  return <div className="flex flex-col"></div>
}
