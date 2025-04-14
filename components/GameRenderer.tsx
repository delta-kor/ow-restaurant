import { createBackgroundGraphics } from '@/lib/game/background'
import { recipe } from '@/lib/restaurant/restaurant'
import { extend, useApplication } from '@pixi/react'
import { Effect } from 'effect'
import { useTranslations } from 'next-intl'
import { Container } from 'pixi.js'
import { useEffect } from 'react'

extend({
  Container,
})

export default function GameRenderer({ stageId }: { stageId: number }) {
  const { app } = useApplication()
  const t = useTranslations()

  useEffect(() => {
    clearApp()
    renderBackground()
  }, [])

  const clearApp = () => {
    app.stage.removeChildren()
    app.renderer.render(app.stage)
  }

  const renderBackground = () => {
    const graphics = createBackgroundGraphics(app, t)
    app.stage.addChild(...graphics)
  }

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  return <pixiContainer />
}
