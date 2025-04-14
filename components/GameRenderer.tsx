import useGameManager from '@/lib/game/game-manager'
import { recipe } from '@/lib/restaurant/restaurant'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { Container } from 'pixi.js'
import { useEffect } from 'react'

extend({
  Container,
})

export default function GameRenderer({ stageId }: { stageId: number }) {
  const { app } = useApplication()

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge
  const gameManager = useGameManager(app, fridge)

  useEffect(() => {
    // const graphics = new Graphics().rect(634, 300, 10, 10).fill(0xff0000)
    // app.stage.addChild(graphics)
  }, [])

  return <pixiContainer />
}
