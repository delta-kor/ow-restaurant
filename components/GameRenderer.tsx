import useGameManager from '@/lib/game/game-manager'
import { Item } from '@/lib/restaurant/item'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { Container } from 'pixi.js'

extend({
  Container,
})

export default function GameRenderer({
  stageId,
  onItemCreate,
}: {
  stageId: number
  onItemCreate: (item: Item) => void
}) {
  const { app } = useApplication()

  const stage = getRecipe(null).getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  const gameManager = useGameManager(app, fridge, onItemCreate)

  return <pixiContainer sortableChildren={true} />
}
