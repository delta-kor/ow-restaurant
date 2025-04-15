import useGameManager from '@/lib/game/game-manager'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { Container } from 'pixi.js'
import { useEffect } from 'react'

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

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  const gameManager = useGameManager(app, fridge, onItemCreate)

  useEffect(() => {}, [])

  return <pixiContainer sortableChildren={true} />
}
