import GameConstraints from '@/lib/game-constraints'
import { recipe } from '@/lib/restaurant/restaurant'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { Container, Graphics } from 'pixi.js'
import { useEffect } from 'react'

extend({
  Container,
  Graphics,
})

export default function GameRenderer({ stageId }: { stageId: number }) {
  const { app } = useApplication()

  useEffect(() => {
    renderBackground()
  }, [])

  const renderBackground = () => {
    const screenWidth = app.screen.width
    const screenHeight = app.screen.height

    // Render fridge
    const fridge = new Graphics()
      .roundRect(
        GameConstraints.Fridge.getX(screenWidth),
        GameConstraints.Fridge.getY(),
        GameConstraints.Fridge.getWidth(),
        GameConstraints.Fridge.getHeight(),
        GameConstraints.Fridge.Rounded
      )
      .fill(GameConstraints.Color.PrimaryBackground)

    app.stage.addChild(fridge)
  }

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  return <pixiContainer />
}
