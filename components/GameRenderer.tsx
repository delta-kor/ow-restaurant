import useGameManager from '@/lib/game/game-manager'
import { Item } from '@/lib/restaurant/item'
import { Recipe } from '@/lib/restaurant/recipe'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { Container } from 'pixi.js'

extend({
  Container,
})

export default function GameRenderer({
  recipe,
  stageId,
  onItemCreate,
}: {
  recipe: Recipe
  stageId: number
  onItemCreate: (item: Item) => void
}) {
  const { app, isInitialised } = useApplication()

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  const gameManager = useGameManager(app, fridge, onItemCreate, recipe, isInitialised)

  return <pixiContainer sortableChildren={true} />
}
